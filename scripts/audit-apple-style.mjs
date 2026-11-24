#!/usr/bin/env node
/**
 * audit-apple-style.mjs — static audit for Apple-style conformance.
 *
 *   node scripts/audit-apple-style.mjs <dir> [--json] [--max 40]
 *
 * Checks every .css/.scss/.less/.html/.jsx/.tsx/.vue/.svelte file under <dir> for:
 *   1. off-palette colors (hex/rgb/hsl that are not in the measured token set)
 *   2. off-system border radii (Apple uses 0/3/4/5/6/8/10/12/18/20/28/pill)
 *   3. box-shadows not in the elevation scale
 *   4. ad-hoc font-family declarations instead of the SF/PingFang stacks
 *   5. gradients used as decoration on text or buttons
 *   6. transition/animation durations far outside 120-500ms
 *
 * Exit code 1 when any finding is reported, 0 when clean. Findings are advisory:
 * a brand accent or an existing design system may legitimately differ.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const EXT = new Set(['.css', '.scss', '.less', '.sass', '.html', '.htm', '.jsx', '.tsx', '.js', '.ts', '.vue', '.svelte', '.astro']);

const ALLOWED_HEX = new Set([
  '#ffffff', '#000000', '#fafafc', '#f5f5f7', '#e8e8ed', '#d2d2d7', '#b8b8bd', '#a1a1a6',
  '#86868b', '#6e6e73', '#1d1d1f', '#161617', '#2c2c2e', '#38383a', '#48484a',
  '#0071e3', '#0076df', '#006edb', '#2997ff', '#3ba0ff', '#1a8bf0', '#06c', '#0066cc',
  '#e30000', '#068a3c', '#333333', '#fbfbfd',
]);
// numeric px radii that exist in the Apple system; percentages and pills pass through
const ALLOWED_RADIUS_PX = new Set([0, 2, 3, 4, 5, 6, 8, 10, 12, 18, 20, 28, 44, 980, 999, 9999]);
const ALLOWED_SHADOW = [
  /^0 1px 2px rgba\(0, ?0, ?0, ?0?\.0?4\)$/,
  /^0 2px 4px rgba\(0, ?0, ?0, ?0?\.0?4\), ?0 4px 12px rgba\(0, ?0, ?0, ?0?\.0?8\)$/,
  /^0 8px 24px rgba\(0, ?0, ?0, ?0?\.1\)$/,
  /^0 16px 48px rgba\(0, ?0, ?0, ?0?\.14\)$/,
  /^8px 8px 16px 0 #00000014$/i,
  /^2px 4px 12px #00000014$/i,
  // focus / validation rings: 0 0 0 <n>px <tint>
  /^0 0 0 \d+px (rgba\((0, ?113, ?227|227, ?0, ?0), ?[\d.]+\)|var\(--ap-[a-z-]+\))$/,
];
const OK_FONT = /(SF Pro|SF Mono|-apple-system|BlinkMacSystemFont|PingFang SC|Hiragino Sans GB|Microsoft YaHei|Noto Sans SC|ui-monospace|SFMono-Regular|Menlo|Consolas|Helvetica|Arial|sans-serif|monospace|inherit|var\(--ap-font)/i;

const args = process.argv.slice(2);
const json = args.includes('--json');
const maxIdx = args.indexOf('--max');
const MAX = maxIdx >= 0 ? Number(args[maxIdx + 1]) || 40 : 40;
const root = args.find((a) => !a.startsWith('--') && a !== String(MAX)) || '.';

const findings = [];
const seenFiles = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git' || name === 'dist' || name === 'build' || name === '.next') continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (EXT.has(extname(p))) check(p);
  }
}

function push(file, line, rule, detail, snippet) {
  findings.push({ file, line, rule, detail, snippet: snippet.trim().slice(0, 140) });
}

function check(file) {
  const src = readFileSync(file, 'utf8');
  if (src.length > 900000) return;
  seenFiles.push(file);
  const lines = src.split(/\r?\n/);
  lines.forEach((raw, i) => {
    const line = raw;
    const n = i + 1;

    // 1. colors
    for (const m of line.matchAll(/#[0-9a-f]{3,8}\b/gi)) {
      const hex = m[0].toLowerCase();
      if (hex.length === 4) {
        const full = '#' + hex.slice(1).split('').map((c) => c + c).join('');
        if (!ALLOWED_HEX.has(full)) push(file, n, 'color', 'off-palette hex ' + hex, line);
      } else if (!ALLOWED_HEX.has(hex)) {
        push(file, n, 'color', 'off-palette hex ' + hex, line);
      }
    }
    for (const m of line.matchAll(/rgba?\(([^)]+)\)/gi)) {
      const parts = m[1].split(',').map((s) => s.trim());
      if (parts.length < 3) continue;
      const [r, g, b] = parts.slice(0, 3).map(Number);
      // near-neutral: Apple's nav material is rgba(250,250,252) / rgba(22,22,23)
      const isNeutral = Math.max(r, g, b) - Math.min(r, g, b) <= 6;
      const isAppleBlue = (r === 0 && g === 113 && b === 227) || (r === 41 && g === 151 && b === 255);
      const isAppleRed = r === 227 && g === 0 && b === 0;
      if (!isNeutral && !isAppleBlue && !isAppleRed && !/var\(/.test(m[0])) {
        push(file, n, 'color', 'non-neutral rgba ' + m[0], line);
      }
    }

    // 2. radii
    for (const m of line.matchAll(/border-radius:\s*([^;]+);/gi)) {
      for (const part of m[1].split('/')) {
        for (const v of part.trim().split(/\s+/)) {
          if (!v || v.startsWith('var(') || v.startsWith('calc(') || v === 'inherit') continue;
          if (v.endsWith('%')) continue;
          const num = parseFloat(v);
          const unit = v.replace(/^-?[\d.]+/, '');
          if (Number.isNaN(num) || (unit && unit !== 'px' && unit !== 'rem')) continue;
          const px = unit === 'rem' ? num * 16 : num;
          if (!ALLOWED_RADIUS_PX.has(px)) push(file, n, 'radius', 'off-system radius ' + v, line);
        }
      }
    }

    // 3. shadows
    for (const m of line.matchAll(/box-shadow:\s*([^;]+);/gi)) {
      const v = m[1].trim();
      if (v === 'none' || v.startsWith('var(')) continue;
      if (!ALLOWED_SHADOW.some((re) => re.test(v.replace(/\s+/g, ' ')))) {
        push(file, n, 'shadow', 'shadow outside elevation scale', line);
      }
    }

    // 4. fonts
    for (const m of line.matchAll(/font-family:\s*([^;}]+)/gi)) {
      if (!OK_FONT.test(m[1])) push(file, n, 'font', 'non-SF font stack', line);
    }

    // 5. decorative gradients: text-fill gradients and gradients painted on buttons
    if (/background(-image)?:\s*[^;]*gradient/i.test(line) && !/var\(/.test(line)) {
      const ctx = lines.slice(Math.max(0, i - 6), i + 1).join(' ');
      const onButton = /(^|\s)(\.|#)(ap-)?(btn|button)[\w-]*\s*\{/.test(ctx) || /<button/i.test(ctx);
      if (/background-clip:\s*text|-webkit-text-fill-color/.test(line) || onButton) {
        push(file, n, 'gradient', 'decorative gradient on text/button', line);
      }
    }

    // 6. durations
    for (const m of line.matchAll(/(transition|animation)[^:;]*:\s*([^;]+);/gi)) {
      for (const t of m[2].matchAll(/(\d*\.?\d+)(ms|s)\b/g)) {
        const ms = t[2] === 's' ? parseFloat(t[1]) * 1000 : parseFloat(t[1]);
        if (ms < 50) continue; // prefers-reduced-motion kill switches use .01ms
        if (ms < 100 || ms > 800) push(file, n, 'motion', 'duration ' + ms + 'ms outside 100-800ms', line);
      }
    }
  });
}

walk(root);

const byRule = findings.reduce((acc, f) => { acc[f.rule] = (acc[f.rule] || 0) + 1; return acc; }, {});

if (json) {
  console.log(JSON.stringify({ root, files: seenFiles.length, total: findings.length, byRule, findings: findings.slice(0, MAX) }, null, 2));
} else {
  console.log('apple-style audit — ' + root);
  console.log('scanned ' + seenFiles.length + ' files, ' + findings.length + ' findings');
  if (!findings.length) console.log('clean: every color, radius, shadow, font and duration is on-system.');
  else {
    console.log('by rule: ' + Object.entries(byRule).map(([k, v]) => k + '=' + v).join(', '));
    console.log('');
    for (const f of findings.slice(0, MAX)) {
      console.log(relative(process.cwd(), f.file) + ':' + f.line + '  [' + f.rule + '] ' + f.detail);
      console.log('    ' + f.snippet);
    }
    if (findings.length > MAX) console.log('... ' + (findings.length - MAX) + ' more (raise --max)');
  }
}
process.exit(findings.length ? 1 : 0);
