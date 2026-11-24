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

Apple's motion has **two layers**, and confusing them is why most "Apple-like" UIs feel dead.

**Layer 1 — state changes on the marketing pages.** Short, damped, no overshoot. These are real
beziers measured out of apple.com/store CSS:

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
| Button hover | background-color, color | 160ms | ease |
| Link underline | border-color | 160ms | ease |
| Card hover lift | transform (2px), box-shadow | 240ms | ease |
| Nav background on scroll | background-color | 240ms | ease |
| Image zoom on hover | transform scale(1 → 1.03) | 400ms | ease-out |
| Accordion | grid-template-rows / max-height | 240ms | ease |

**Layer 2 — the "q弹".** The springy feel people recognise from iOS is a *damped spring*
(`SwiftUI.Spring`), not a bezier. Apple models it with two numbers:

```
Spring(duration: response, bounce: b)
  omega0 = 2 * PI / response
  zeta   = b >= 0 ? 1 - b : 1 / (1 + b)      // damping ratio
```

Verify against Apple's own documented example — `Spring(duration: 0.5, bounce: 0.3)` gives
`mass 1, stiffness 157.9, damping 17.6`:

```
omega0 = sqrt(157.9) = 12.566 = 2*PI/0.5   ✓
zeta   = 17.6 / (2 * 12.566) = 0.70        ✓  (= 1 - 0.3)
```

A damped spring has **no cubic-bezier equivalent** — beziers cannot overshoot and re-settle. CSS
`linear()` can: it takes an arbitrary stop list whose output may exceed 1. So the spring is
pre-compiled into `linear()` stop lists:

```css
--ap-spring-snappy: linear(0, 0.045, 0.152, … 1.015, 1.014, … 1);  /* 327ms */
--ap-spring-smooth: linear(0, 0.036, 0.12,  … 1);                  /* 351ms, no overshoot */
--ap-spring-bouncy: linear(0, 0.04, 0.137,  … 1.038, 1.037, … 1);  /* 363ms */
--ap-spring-gentle: linear(0, 0.037, 0.123, … 1.002, 1.001, … 1);  /* 471ms */
```

| Token | bounce | response | settle | peak | Use |
| --- | --- | --- | --- | --- | --- |
| `--ap-spring-snappy` | .20 | .25s | 327ms | 1.015 | press/release, button give, chip select |
| `--ap-spring-smooth` | .05 | .30s | 351ms | 1.000 | hover lift, nav, generic state change |
| `--ap-spring-bouncy` | .28 | .30s | 363ms | 1.038 | modal/sheet enter, switch knob, pop-in |
| `--ap-spring-gentle` | .10 | .40s | 471ms | 1.002 | scroll reveal, expanding panels |

**Regenerate, never hand-edit:**

```bash
node scripts/spring-easing.mjs --css                      # token block for :root
node scripts/spring-easing.mjs --bounce .2 --response .3  # one curve
```

The CSS ships a bezier fallback in `:root` and replaces it inside
`@supports (transition-timing-function: linear(0,1))`, so engines without `linear()` degrade to a
plain ease-out instead of breaking.

Usage — always pair the curve with its own duration, because the duration *is* the settle time:

```css
/* press: the element gives, then springs back */
.ap-press{transition:transform var(--ap-spring-snappy-dur) var(--ap-spring-snappy)}
.ap-press:active{transform:scale(.96)}

/* entrance */
.ap-pop{animation:ap-pop-in var(--ap-spring-bouncy-dur) var(--ap-spring-bouncy) both}
@keyframes ap-pop-in{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
```

Hard limits — these are what keep the bounce from reading as a toy:

- Overshoot is a **ceiling, not a target**: peak ≤ 1.04. `bounce ≥ .4` looks like a game UI.
- Settle time ≤ 500ms. Raising `bounce` raises settle time too, so a big bounce must use a
  shorter response.
- Springs are for **transform and opacity only** — the properties a spring can physically drive.
  Colour, background and shadow stay on the 160–400ms beziers from layer 1.
- No spring on scroll-linked or looping motion. No rotation, no spin-in.
- Never `cubic-bezier(.34,1.56,.64,1)` — that is an overshoot bezier, the wrong tool: it has no
  settle phase and its shape does not match any spring. Use the tokens instead.
- Animate only `transform`, `opacity`, `color`, `background-color`, `box-shadow`.
  Never `width`, `height`, `top`, `left`, `margin`.
- Respect `@media (prefers-reduced-motion: reduce)`: `transition-duration:.01ms` globally, and
  drop press/lift transforms entirely — springs become instant state changes.

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
