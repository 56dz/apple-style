# Apple design tokens (measured)

Source: `https://www.apple.com.cn/store` and the CSS it ships —
`ac-globalnav.css`, `rs-vendor …/common.css`, `store-home.css` — read on 2026-11-24.
Values are quoted as they appear in production; the `--ap-*` column is the name used by
`assets/apple.css`.

## Color — light

| Token | Value | Measured use |
| --- | --- | --- |
| `--ap-ink` | `#1d1d1f` | primary text, headlines, dark button fill |
| `--ap-ink-80` | `rgba(0,0,0,.8)` | nav links |
| `--ap-ink-56` | `rgba(0,0,0,.56)` | disabled/secondary alpha variant |
| `--ap-gray` | `#6e6e73` | secondary text, subheads |
| `--ap-gray-3` | `#86868b` | tertiary text, captions, footer |
| `--ap-hairline` | `#d2d2d7` | 1px separators, input borders |
| `--ap-surface` | `#f5f5f7` | page sections, cards, footer |
| `--ap-surface-2` | `#e8e8ed` | hovered paddlenav/dotnav, pressed chips |
| `--ap-white` | `#ffffff` | cards on gray, page base |
| `--ap-blue` | `#0071e3` | primary action, focus ring |
| `--ap-blue-hover` | `#0076df` | hover fill (from `--sk-button-background-hover`) |
| `--ap-blue-active` | `#006edb` | active fill |
| `--ap-link` | `#06c` | inline text links (`--sk-body-link-color`) |
| `--ap-black` | `#000000` | true-black canvas (dark hero, dark mode base) |

Apple never uses a second saturated hue for UI chrome. The only other colors on the store page
belong to product imagery (`#f8ab5e`, `#ff2469`, `#c65cff`, …) — those are content, not tokens.

## Color — dark

| Token | Value |
| --- | --- |
| `--ap-dark-canvas` | `#000000` |
| `--ap-dark-surface` | `#1d1d1f` |
| `--ap-dark-surface-2` | `#2c2c2e` |
| `--ap-dark-text` | `#f5f5f7` |
| `--ap-dark-text-80` | `rgba(255,255,255,.92)` |
| `--ap-dark-gray` | `#86868b` |
| `--ap-dark-nav` | `rgba(22,22,23,.8)` |
| `--ap-dark-blue` | `#2997ff` |

`#2997ff` is the dark-mode action blue Apple uses on apple.com dark sections; it is lighter so it
keeps 4.5:1 on black.

## Typography

Stacks (verbatim from the CSS):

```css
/* Latin display */  "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
/* Latin text   */  "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
/* Simplified Chinese */
"SF Pro SC", "SF Pro Text", "SF Pro Icons", "PingFang SC", "Helvetica Neue", Helvetica, Arial, sans-serif;
```

CJK note: SF Pro SC does not exist on Windows/Linux; `PingFang SC` is macOS-only. Ship a web-font
fallback (`Inter`, `-apple-system`, `"Noto Sans SC"`) and keep the rest of the stack.

Sizes actually present in the shipped CSS (px): 96, 89, 80, 64, 51, 48, 44, 40, 38, 37, 34, 32,
30, 28, 24, 22, 21, 19, 18, 17, 16, 14, 12, 11, 10.

Working scale:

| Role | Size / line-height | Weight | Tracking | Token |
| --- | --- | --- | --- | --- |
| Display XL | 80 / 1.05 | 600 | -0.015em | `--ap-display-xl` |
| Display | 64 / 1.07 | 600 | -0.015em | `--ap-display` |
| Title 1 | 48 / 1.08 | 600 | -0.01em | `--ap-title-1` |
| Title 2 | 40 / 1.1 | 600 | -0.009em | `--ap-title-2` |
| Title 3 | 32 / 1.15 | 600 | -0.006em | `--ap-title-3` |
| Title 4 | 24 / 1.2 | 600 | -0.003em | `--ap-title-4` |
| Body large | 19 / 1.42 | 400 | 0.007em | `--ap-body-lg` |
| Body | 17 / 1.47 | 400 | -0.022em | `--ap-body` |
| Body small | 14 / 1.43 | 400 | -0.016em | `--ap-body-sm` |
| Caption | 12 / 1.33 | 400 | -0.01em | `--ap-caption` |
| Footnote | 10 / 1.3 | 400 | 0 | `--ap-footnote` |

Rules that make it read as Apple:
- Weights are 400 and 600 only. Never 700+ for Latin display type; Apple's headline weight is 600.
- Negative tracking only above 24px; body text sits at -0.022em (Apple's `--sk-body` value).
- CJK text: tracking 0 to 0.01em, line-height 1.5–1.7 — negative tracking looks broken in Chinese.
- Never letter-space all-caps; Apple uses no uppercase labels.

## Radius

Measured set: `0, 3, 4, 5, 6, 8, 10, 12, 18, 20, 28, 50%, 99px, 980px, 999px`.

| Token | Value | Use |
| --- | --- | --- |
| `--ap-r-xs` | 5px | badges, tiny chips |
| `--ap-r-sm` | 8px | small buttons (store inline CTAs), tags |
| `--ap-r-md` | 12px | inputs, selects, small cards |
| `--ap-r-lg` | 18px | product tiles, images in cards |
| `--ap-r-xl` | 28px | hero cards, modals, sheets |
| `--ap-r-pill` | 980px | all pill buttons, segmented controls, nav chips |

## Elevation

Apple ships very few shadows; the two that appear in `store-home.css`:

```css
box-shadow: 8px 8px 16px 0 #00000014;  /* floating product/price card */
box-shadow: 2px 4px 12px #00000014;    /* sticky mini-cart / sheet */
```

| Token | Value | Use |
| --- | --- | --- |
| `--ap-shadow-1` | `0 1px 2px rgba(0,0,0,.04)` | sticky sub-nav hairline reinforcement |
| `--ap-shadow-2` | `0 2px 4px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.08)` | cards on hover |
| `--ap-shadow-3` | `0 8px 24px rgba(0,0,0,.10)` | menus, popovers |
| `--ap-shadow-4` | `0 16px 48px rgba(0,0,0,.14)` | modals, sheets |

Never put a shadow on a product image, and never combine a visible border with a shadow.

## Materials (translucency)

Measured:

| Element | Background | Blur |
| --- | --- | --- |
| Global nav (light) | `rgba(250,250,252,.8)` | `saturate(180%) blur(20px)` |
| Global nav (scrolled) | `rgba(250,250,252,.92)` | same |
| Global nav (dark) | `rgba(22,22,23,.8)` | same |
| Sub-nav / tab nav | `rgba(232,232,237,.4)` over content | `blur(20px)` |
| Scrim behind sheet | `rgba(0,0,0,.4)` | — |
| Paddlenav arrow | `#424245b8` (dark) / `#d2d2d7a3` (light) | — |

Rule: blur only where content scrolls underneath. A static card is opaque.

## Spacing and layout

- 8pt scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 120.
- Section vertical padding measured on the store home: `32px`, `54px`, `76px`, `96px`
  (desktop `76px 6.25%`, hero `96px 76px`). Mobile halves these.
- Max widths measured: 1680 (full grid), 1440 (wide grid), 1023 / 1000 / 980 (text column),
  816 (prose), 640 / 700 (narrow prose), 420 / 329 (mobile card).
- Grid gutters: 24px inner, 24px outer (from `--sk-cssgrid-*`).
- Nav height: 44px (48px on large viewports); sub-nav 52px; footer columns 5-up desktop, stacked mobile.
- Breakpoints used by Apple: 1068px, 734px, 480px. Use those, not Tailwind's defaults, when matching.

## Focus and interaction

```css
--ap-focus: #0071e3;        /* --sk-focus-color */
--ap-focus-offset: 1px;     /* --sk-focus-offset */
```

Focus ring: `outline: 2px solid var(--ap-focus); outline-offset: 2px;` or
`box-shadow: 0 0 0 4px rgba(0,113,227,.3)` on filled controls.
Disabled opacity: `0.42` (`--sk-link-disabled-opacity`).

## Motion

Two layers. Beziers for state changes, springs for physical give — see
`references/motion-and-materials.md` §3 for the model and the limits.

| Token | Value | Settle | Peak |
| --- | --- | --- | --- |
| `--ap-ease` | `cubic-bezier(.4,0,.6,1)` | — | — |
| `--ap-ease-out` | `cubic-bezier(0,0,.58,1)` | — | — |
| `--ap-dur-fast` | 160ms | — | — |
| `--ap-dur` | 240ms | — | — |
| `--ap-dur-slow` | 400ms | — | — |
| `--ap-spring-snappy` | `linear(0, …1.015, …1)` | 327ms | 1.015 |
| `--ap-spring-smooth` | `linear(0, …1)` | 351ms | 1.000 |
| `--ap-spring-bouncy` | `linear(0, …1.038, …1)` | 363ms | 1.038 |
| `--ap-spring-gentle` | `linear(0, …1.002, …1)` | 471ms | 1.002 |

Each spring has a matching `--ap-spring-<name>-dur` token; use them as a pair. The full stop
lists live in `assets/apple.css` and are generated by `scripts/spring-easing.mjs` from
`Spring(duration: response, bounce: b)` — regenerate rather than editing the numbers.

Allowed transitions: color, background-color, opacity, transform (≤4px translate / 1.02 scale),
box-shadow. Springs may only drive transform and opacity. Never animate width/height/top/left;
never exceed 500ms; spring overshoot never exceeds 4% (peak 1.04).
