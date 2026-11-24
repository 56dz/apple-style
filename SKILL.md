---
name: apple-style
description: Restyle a web frontend to Apple's design language (apple.com / Apple Store): SF-style typography, restrained ink-and-surface palette, hairline glass materials, pill controls, product-first layout with generous whitespace. Use when asked to make a UI look Apple-like (苹果风格 / 苹果风 / Apple design), to audit an existing app against Apple's visual system, or to build new screens in that style.
---

# Apple Style Frontend

Turn any web UI into something that reads as Apple: quiet surfaces, one blue action color,
large confident type with tight tracking, hairline materials instead of borders, pill controls,
and whitespace that lets content breathe. Every value below was measured from
<https://www.apple.com.cn/store> and its shipped CSS (ac-globalnav.css, common.css, store-home.css)
on 2026-11-24 — do not invent substitutes.

## 0. Definition of done

The result is Apple-like when all of these hold:

1. **One accent.** Exactly one saturated color on screen for actions: Apple blue. Everything else
   is ink, gray, white, or product imagery.
2. **Type carries the design.** Display text is 40–96px at weight 600 with negative tracking;
   body is 17px/1.47. Nothing is bold-for-emphasis; hierarchy comes from size and color.
3. **No visible borders on content.** Cards, tiles and inputs separate by surface color
   (#fff vs #f5f5f7) and by hairlines of 1px #d2d2d7 at most — never 2px, never gray-on-gray chrome.
4. **Shadows are almost absent.** Nothing darker than `0 4px 12px rgba(0,0,0,.08)`, and only on
   floating elements (nav menus, sheets, hovered cards). Product imagery never gets a shadow.
5. **Corners are systematic.** 8 / 12 / 18 / 28px or a full pill (980px). No ad-hoc radii.
6. **Motion is quiet.** 200–400ms ease-out, 2–4px translation, opacity fades. No bounce, no
   spin-in, no parallax beyond a slow image scale on hover.
7. **Whitespace is the layout.** Sections pad 64–96px vertically on desktop; content max-width
   980px (text) or 1440px (grids); nothing touches the viewport edge closer than 20px on mobile.

If a change makes the page louder, it is wrong, even if it looks "premium".

## 1. Workflow

Follow this order; each step has a matching reference file.

### Step 1 — Inventory (never restyle blind)
Read the entry HTML/CSS and list: existing font stacks, every hex color, every border-radius,
every box-shadow, every gradient, spacing scale, and the component inventory (nav, hero, cards,
forms, tables, modals, footer). Also record whether the app is React/Vue/Svelte/plain HTML and
whether it uses Tailwind, CSS modules, styled-components, or inline styles.
→ `references/workflow.md` §1 has the exact grep commands and the inventory table to fill in.

> **Cascade warning.** `apple.css` wraps its element base rules in `:where()` so they carry zero
> specificity and every `.ap-*` class wins. If you port these rules into an app that already styles
> `h1`/`p`/`a`, keep that `:where()` wrapper — dropping it is what makes an imported design system
> silently lose to the host page (a blue "Store" brand, a link-coloured button label, etc.).

### Step 2 — Install the token layer
Copy `assets/apple.css` into the project (or inline its `:root` block into the global stylesheet)
and make sure it loads before app styles. It defines `--ap-*` variables plus `.ap-*` base classes.
Then **delete or override** the app's old tokens: this is the step that actually converts the look.
A restyle that keeps the old palette and only rounds corners has failed.
→ Tokens: `references/design-tokens.md` (full measured table, light + dark).

### Step 3 — Recompose components
Rebuild each component from the recipes in `references/components.md`: nav, buttons, cards/tiles,
inputs, badges, segmented controls, modals, footer. Use the recipe's structure, not the old markup's
styling. Keep the app's behavior and accessibility attributes; change only the visual layer.

### Step 4 — Typography and rhythm pass
Set the type scale (`references/design-tokens.md` §Type), tighten display tracking, set line-heights,
and apply the 8pt spacing scale with section paddings of 64–96px desktop / 32–48px mobile.

### Step 5 — Verify visually, then fix
Run the page at 1440 / 768 / 390px, screenshot each, and check against the checklist in §3.
Run `node scripts/audit-apple-style.mjs <dir>` to catch leftover off-palette colors, radii and
heavy shadows mechanically. Iterate until the audit is clean and the screenshots hold up.

## 2. Component map (summary)

| Component | Recipe | Key numbers |
| --- | --- | --- |
| Global nav | `components.md` §1 | 44px (48px large) tall, `rgba(250,250,252,.8)` + `saturate(180%) blur(20px)`, 12px links, `rgba(0,0,0,.8)` |
| Primary button | §2 | pill `980px`, `#0071e3`, white 17px, 12px 22px padding, hover `#0076df`, active `#006edb` |
| Secondary button | §2 | 1px `#0071e3` outline, transparent fill, fills on hover |
| Text link | §2 | `#06c`, no underline until hover, 1px underline offset 3px |
| Product card / tile | §3 | radius 18px, `#f5f5f7` on white or white on `#f5f5f7`, no border, hover lift 2px |
| Hero | §4 | centered, display 48–80px, 8–16px subhead `#6e6e73`, image below the fold line |
| Input / select | §5 | 12px radius, `#f5f5f7` fill or 1px `#d2d2d7`, focus ring 2px `#0071e3` |
| Badge / chip | §6 | pill, 12px, `#f5f5f7` bg, `#6e6e73` text, or blue-tinted for "new" |
| Modal / sheet | §7 | radius 18–28px, `rgba(255,255,255,.92)` + `saturate(180%) blur(20px)`, `0 8px 24px rgba(0,0,0,.10)` |
| Footer | §8 | `#f5f5f7`, 12px `#6e6e73` links in columns, hairline separators |

## 3. Verification checklist

Check every item against a screenshot, not against the code:

- [ ] No color on the page outside ink/gray/white + one blue (+ product imagery).
- [ ] Every radius is 0/8/12/18/28/980 — spot-check 5 randomly.
- [ ] No shadow with blur > 12px or alpha > .12; no shadow on images or cards at rest.
- [ ] No border thicker than 1px anywhere; hairlines only.
- [ ] Display type: weight 600, letter-spacing ≤ -0.01em (Latin only — CJK keeps 0 to 0.01em).
- [ ] Body text is 17px (or 14px for dense UI) with 1.4–1.5 line-height.
- [ ] Section rhythm is a multiple of 8; vertical padding 64–96px desktop.
- [ ] Nav is translucent with blur over scrolling content; it never becomes a solid gray bar.
- [ ] Hover states exist for every interactive element and are color/opacity only (plus ≤2px lift).
- [ ] Focus ring visible: 2px `#0071e3` with 1px offset.
- [ ] Dark mode (if present) uses `#000` canvas, `#1d1d1f` surfaces, `#f5f5f7` text.
- [ ] No emoji icons, no all-caps headings, no gradients except one optional soft hero wash.

## 4. Anti-patterns (each one breaks the illusion)

- Purple/blue gradient blobs, mesh gradients, glowing orbs.
- Glassmorphism on everything; blur is for the nav and sheets only.
- 2px+ borders, colored borders, "card with border + shadow" combos.
- Multiple accent colors, or accent used for decoration rather than action.
- Bold (700+) body text, letter-spacing 0 on display type, text-shadow.
- Radius soup (3px here, 6px there, 14px elsewhere).
- Drop shadows with y-offset > 8px or blur > 12px.
- Dense 100%-width tables with grid lines; Apple uses whitespace and hairlines.
- Icons with mismatched stroke weights; use one icon set at 1.5–2px stroke.
- Motion with bounce, spring overshoot, or duration > 500ms.

## 5. Framework notes

- **Tailwind**: `assets/tailwind-apple.js` is a ready preset (colors, radii, shadows, fonts,
  type scale). Register it in `tailwind.config` `presets` and stop using default gray/blue scales.
- **CSS-in-JS / CSS modules**: import `assets/apple.css` once globally for tokens, then reference
  `var(--ap-blue)` etc. in component styles. Never re-declare raw hex in components.
- **Plain HTML**: link `assets/apple.css` and use the `.ap-*` classes directly; `assets/demo.html`
  is a working showcase of every component.
- **Existing design system (MUI/Ant/Element)**: override the theme's palette/radius/typography with
  the token table instead of restyling components one by one; then patch the few components that
  ignore the theme (usually buttons and cards).

## 6. Files

| File | Purpose |
| --- | --- |
| `assets/apple.css` | Token layer + base classes (nav, buttons, cards, forms, footer, dark mode) |
| `assets/tailwind-apple.js` | Tailwind preset mirroring the tokens |
| `assets/demo.html` | Reference page proving the style; use it to compare screenshots |
| `assets/preview-hero.png`, `assets/preview-forms.png` | Rendered reference of demo.html (light mode) |
| `references/design-tokens.md` | Every measured token, light + dark, with sources |
| `references/components.md` | Component recipes with markup and CSS |
| `references/motion-and-materials.md` | Blur/translucency, elevation, motion curves |
| `references/workflow.md` | Inventory commands, migration order, QA procedure |
| `scripts/audit-apple-style.mjs` | Static audit for off-system colors, radii, shadows |
