# Workflow: converting an existing app

## 1. Inventory

Collect facts before touching styles. Use the project's own tooling; these commands are generic.

```bash
# fonts and colors
rg -o --no-filename "font-family:\s*[^;]+" -g '*.css' -g '*.scss' | sort -u
rg -o --no-filename "#[0-9a-fA-F]{3,8}" -g '*.css' -g '*.scss' -g '*.tsx' -g '*.vue' | sort | uniq -c | sort -rn | head -40
# radii, shadows, gradients
rg -o --no-filename "border-radius:\s*[^;]+" -g '*.css' | sort | uniq -c | sort -rn | head -30
rg -o --no-filename "box-shadow:\s*[^;]+" -g '*.css' | head -30
rg -o --no-filename "gradient\([^)]*\)" -g '*.css' | head -20
# design system in use
rg -l "tailwind|styled-components|@mui|antd|element-plus|chakra" package.json
```

Fill this table before editing anything:

| Area | Current | Target token |
| --- | --- | --- |
| Body font | … | `--ap-font-text` |
| Display font | … | `--ap-font-display` |
| Page background | … | `#fff` / `--ap-surface` |
| Primary action color | … | `--ap-blue #0071e3` |
| Link color | … | `--ap-link #06c` |
| Secondary text | … | `--ap-gray #6e6e73` |
| Border color/width | … | `--ap-hairline #d2d2d7` 1px |
| Card radius | … | 18px |
| Button radius | … | 980px (pill) or 8px (inline CTA) |
| Shadow scale | … | `--ap-shadow-1..4` |
| Section padding | … | 76px desktop / 40px mobile |

## 2. Migration order

Change in this sequence; each step is verifiable on its own.

1. **Tokens first.** Load `assets/apple.css` globally and map the app's existing variables onto
   `--ap-*` where names differ (e.g. `--brand: #6c5ce7` → `--brand: var(--ap-blue)`). Deleting the
   old palette is the single highest-impact change.
2. **Typography.** Swap the font stack, then the scale. Fix line-heights and tracking last —
   tracking on the wrong size looks worse than no tracking.
3. **Surfaces.** Replace borders with surface contrast; flatten gradients to flat fills.
4. **Radius and shadow.** Normalize to the 0/8/12/18/28/pill set, then remove rest-state shadows.
5. **Components.** Rebuild nav, buttons, cards, inputs from `references/components.md`.
6. **Rhythm.** Apply the 8pt spacing scale and section paddings; widen the text column to ≤980px.
7. **States.** Hover, focus-visible, active, disabled, loading, empty, error — every one must exist
   and use only color/opacity/2px lift.
8. **Dark mode** (if the app has it): `#000` canvas, `#1d1d1f` surfaces, `#f5f5f7` text,
   `#2997ff` action blue.

## 3. Framework-specific notes

**Tailwind** — add `assets/tailwind-apple.js` to `presets`, then replace `gray-*`/`blue-*` usages
with the semantic names (`ink`, `surface`, `hairline`, `accent`). Remove `shadow-lg`/`shadow-xl`
in favour of `shadow-ap-2`…`shadow-ap-4`.

**CSS Modules / styled-components** — import `assets/apple.css` once in the app root, and inside
components use `var(--ap-*)` only. A component that hardcodes `#0071e3` is a bug; it will drift.

**MUI** — `createTheme({ palette:{ primary:{ main:'#0071e3' }, text:{ primary:'#1d1d1f',
secondary:'#6e6e73' }, background:{ default:'#fff', paper:'#f5f5f7' } }, shape:{ borderRadius:12 },
typography:{ fontFamily:'"SF Pro Text", …', button:{ textTransform:'none', borderRadius:980,
fontWeight:400 } } })`. Then patch `MuiButton`, `MuiPaper` (remove elevation), `MuiCard` (remove border).

**Ant Design / Element Plus** — override CSS variables (`--el-color-primary: #0071e3`,
`--el-border-radius-base: 12px`, `--ant-color-primary: #0071e3`) and disable component borders and
default shadows at the theme level.

**Plain HTML** — link the stylesheet and use `.ap-*` classes; `assets/demo.html` shows every component.

## 4. QA procedure

1. Run the static audit: `node scripts/audit-apple-style.mjs <project-dir>`. It reports colors
   outside the palette, radii outside the set, shadows above the limit, gradients, and 2px+ borders.
2. Build and serve the app. Capture 1440×900, 768×1024, 390×844.
3. Walk `SKILL.md` §3 checklist against the screenshots.
4. Check states explicitly: hover every button and card, tab through the page (focus ring visible
   on every stop), open every modal, submit an empty form.
5. Compare side by side with `assets/demo.html` at the same width. If the demo looks calmer,
   the app is still too loud.
6. Only then report done. "Looks close" is not verification.

## 5. Common migration traps

- Keeping the old palette but rounding corners → reads as "generic SaaS with round buttons".
- Adding blur to cards → reads as 2021 glassmorphism, not Apple.
- Using `font-weight:700` for headings because the old design did → too heavy; Apple is 600.
- Letter-spacing -0.02em on CJK text → visibly cramped; keep 0 for Chinese.
- Centering every section → Apple left-aligns body content and centers only heroes.
- Full-width tables with zebra stripes → replace with hairline separators and generous row padding.
- Icon sets mixed from two libraries → stroke weights clash immediately.
