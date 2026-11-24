# Materials and motion

Apple's UI reads as expensive because surfaces behave like physical materials and motion stays
understated. Get these two layers right and even a plain layout starts to look Apple-made.

## 1. Materials

There are exactly three material classes. Do not invent a fourth.

| Material | Appearance | Where |
| --- | --- | --- |
| **Opaque surface** | flat `#fff` or `#f5f5f7`, no blur, no border | cards, sections, footer, inputs |
| **Translucent chrome** | `rgba(250,250,252,.8)` + `saturate(180%) blur(20px)` | global nav, sticky sub-nav, floating toolbars |
| **Scrim** | `rgba(0,0,0,.4)` (+ optional `blur(2px)`) | behind modals and sheets |

Rules:

1. Blur only where content scrolls beneath. A static card never gets `backdrop-filter`.
2. Translucency needs a fallback: `@supports not (backdrop-filter: blur(20px)) { background: #fafafc; }`
   otherwise the nav becomes unreadable over text.
3. Keep the saturation boost. `saturate(180%)` is what makes Apple's nav feel like frosted glass
   rather than gray plastic. Without it, the blur looks muddy.
4. Never stack translucency (nav over sheet over card). One translucent layer per viewport region.
5. Dark chrome: `rgba(22,22,23,.8)` with the same blur; text `rgba(255,255,255,.92)`.

## 2. Elevation

Elevation is a function of "does it float above the page", not "is it important".

| Level | Shadow | Use |
| --- | --- | --- |
| 0 | none | cards at rest, sections, images |
| 1 | `0 1px 2px rgba(0,0,0,.04)` | segmented-control thumb, sticky hairline |
| 2 | `0 2px 4px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.08)` | card hover, dropdown trigger |
| 3 | `0 8px 24px rgba(0,0,0,.10)` | menus, popovers, tooltips |
| 4 | `0 16px 48px rgba(0,0,0,.14)` | modals, sheets |

A card that has a shadow at rest is wrong. Hover is the only way a static card gains elevation.

## 3. Motion

Apple's shipped transitions are short and mostly linear-feeling. Reproduce with:

```css
:root{
  --ap-ease: cubic-bezier(.4,0,.6,1);
  --ap-ease-out: cubic-bezier(0,0,.58,1);
  --ap-dur-fast: 160ms;
  --ap-dur: 240ms;
  --ap-dur-slow: 400ms;
}
```

| Interaction | Property | Duration | Ease |
| --- | --- | --- | --- |
| Button hover/active | background-color, color | 160ms | ease |
| Link underline | border-color | 160ms | ease |
| Card hover lift | transform (2px), box-shadow | 240ms | ease |
| Nav background on scroll | background-color | 240ms | ease |
| Modal enter | opacity, transform (scale .98 → 1) | 240ms | ease-out |
| Sheet enter (mobile) | transform translateY(100%) → 0 | 400ms | ease-out |
| Image zoom on hover | transform scale(1 → 1.03) | 400ms | ease-out |
| Accordion | grid-template-rows / max-height | 240ms | ease |

Hard limits:

- No duration above 500ms except a hero image cross-fade.
- No bounce/spring overshoot. `cubic-bezier(.34,1.56,.64,1)` is anti-Apple.
- No rotation, no spin-in, no staggered list animations longer than 3 items.
- Animate only `transform`, `opacity`, `color`, `background-color`, `box-shadow`.
  Never `width`, `height`, `top`, `left`, `margin`.
- Respect `@media (prefers-reduced-motion: reduce)`: set `transition-duration:.01ms` and drop
  transform-based hovers.

## 4. Scroll behavior

- Nav may hide on scroll-down and reappear on scroll-up (translateY only), 200ms.
- Section reveals: opacity 0→1 with 8px translateY, triggered once, 400ms, no stagger beyond 100ms.
- Scroll-driven product image sequences are allowed only if they never block input; always provide
  a static fallback for reduced motion and low-power devices.
- No parallax on text. No scroll-jacking.

## 5. Imagery

- Product shots: transparent or white background, centered, generous padding (≥40px inside the tile).
- No rounded masks on product photography that already has its own composition; radius belongs to
  the tile, not the product.
- Photography gets no shadow, no border, no gradient overlay except a bottom scrim for text legibility.
- Aspect ratios: 4:3 for tiles, 16:9 for hero video, 1:1 for accessory grids.
