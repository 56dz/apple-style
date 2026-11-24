# Component recipes

Every recipe is production-ready CSS. Class names are `.ap-*` and are defined in
`assets/apple.css`; copy the rules you need rather than inventing variants.

## 1. Global nav

44px tall (48px at ≥1068px), translucent, blur, 12px links, content capped at 1024px.

```html
<header class="ap-nav">
  <div class="ap-nav-inner">
    <a class="ap-nav-brand" href="/" aria-label="Home">◍</a>
    <nav class="ap-nav-links" aria-label="Main">
      <a href="#">Store</a><a href="#">Mac</a><a href="#">iPad</a>
      <a href="#">iPhone</a><a href="#">Watch</a><a href="#">AirPods</a>
      <a href="#">Support</a>
    </nav>
    <button class="ap-nav-icon" aria-label="Search">⌕</button>
  </div>
</header>
```

```css
.ap-nav{position:sticky;top:0;z-index:100;background:rgba(250,250,252,.8);
  backdrop-filter:saturate(180%) blur(20px);-webkit-backdrop-filter:saturate(180%) blur(20px);
  border-bottom:1px solid rgba(0,0,0,.08)}
.ap-nav-inner{max-width:1024px;margin:0 auto;height:44px;padding:0 20px;display:flex;
  align-items:center;justify-content:space-between;gap:24px}
.ap-nav-links{display:flex;gap:28px}
.ap-nav-links a{font:400 12px/1 var(--ap-font-text);color:var(--ap-ink-80);text-decoration:none;
  transition:color var(--ap-dur-fast) var(--ap-ease)}
.ap-nav-links a:hover{color:var(--ap-ink)}
```

Scrolled state: raise the background to `rgba(250,250,252,.92)` and add
`border-bottom-color:rgba(0,0,0,.12)`. Never make the nav opaque gray.

## 2. Buttons and links

```html
<button class="ap-btn ap-btn-primary">Buy</button>
<button class="ap-btn ap-btn-secondary">Learn more</button>
<a class="ap-link" href="#">Compare all models ›</a>
```

```css
.ap-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;
  font:400 17px/1.2 var(--ap-font-text);padding:12px 22px;border-radius:var(--ap-r-pill);
  border:1px solid transparent;cursor:pointer;
  transition:background-color var(--ap-dur-fast) var(--ap-ease),color var(--ap-dur-fast) var(--ap-ease),
             transform var(--ap-dur-fast) var(--ap-ease)}
.ap-btn:active{transform:scale(.98)}
.ap-btn-primary{background:var(--ap-blue);color:#fff}
.ap-btn-primary:hover{background:var(--ap-blue-hover)}
.ap-btn-primary:active{background:var(--ap-blue-active)}
.ap-btn-secondary{background:transparent;color:var(--ap-blue);border-color:var(--ap-blue)}
.ap-btn-secondary:hover{background:var(--ap-blue);color:#fff}
.ap-btn-quiet{background:var(--ap-surface);color:var(--ap-ink)}
.ap-btn-quiet:hover{background:var(--ap-surface-2)}
.ap-btn-dark{background:var(--ap-ink);color:#fff}
.ap-btn-dark:hover{background:#272729}
.ap-btn-lg{font-size:19px;padding:14px 28px}
.ap-btn:disabled{opacity:.42;cursor:not-allowed;transform:none}
.ap-link{color:var(--ap-link);text-decoration:none;
  border-bottom:1px solid transparent;transition:border-color var(--ap-dur-fast) var(--ap-ease)}
.ap-link:hover{border-bottom-color:currentColor}
```

Pill radius is `980px` in Apple's CSS — `--ap-r-pill` keeps that exact number.

## 3. Product card / tile

No border, no rest shadow. Surface color separates it from the page; radius 18px; hover lifts 2px.

```html
<article class="ap-card">
  <div class="ap-card-media"><img src="…" alt="Product"></div>
  <div class="ap-card-body">
    <p class="ap-eyebrow">New</p>
    <h3 class="ap-card-title">iPhone 18 Pro</h3>
    <p class="ap-card-price">From ¥9999</p>
    <button class="ap-btn ap-btn-primary">Buy</button>
  </div>
</article>
```

```css
.ap-card{background:var(--ap-white);border-radius:var(--ap-r-lg);overflow:hidden;
  display:flex;flex-direction:column;transition:transform var(--ap-dur) var(--ap-ease),
  box-shadow var(--ap-dur) var(--ap-ease)}
.ap-card:hover{transform:translateY(-2px);box-shadow:var(--ap-shadow-2)}
.ap-card-media{aspect-ratio:4/3;background:var(--ap-surface);display:grid;place-items:center}
.ap-card-media img{width:100%;height:100%;object-fit:contain}
.ap-card-body{padding:24px;display:flex;flex-direction:column;gap:8px}
.ap-card-title{font:600 24px/1.2 var(--ap-font-display);letter-spacing:-.003em;margin:0}
.ap-card-price{font:400 14px/1.4 var(--ap-font-text);color:var(--ap-gray);margin:0}
.ap-eyebrow{font:400 12px/1.3 var(--ap-font-text);color:var(--ap-gray);margin:0}
```

For a grid of tiles on `#f5f5f7`, invert: card is white, page is `--ap-surface`. For tiles on
white, the card takes `--ap-surface` and the image sits on white.

## 4. Hero

Centered, generous, image-led. Headline 48–80px weight 600; subhead 19–24px in `--ap-gray`.

```html
<section class="ap-hero">
  <h1 class="ap-display">Gifts that land right.</h1>
  <p class="ap-lede">Find the perfect thing for everyone on your list.</p>
  <div class="ap-hero-actions">
    <a class="ap-link" href="#">Shop gifts ›</a>
  </div>
  <img class="ap-hero-media" src="…" alt="">
</section>
```

```css
.ap-hero{text-align:center;padding:96px 24px 0;background:var(--ap-white)}
.ap-display{font:600 clamp(40px,6vw,80px)/1.05 var(--ap-font-display);letter-spacing:-.015em;
  margin:0 0 12px;color:var(--ap-ink)}
.ap-lede{font:400 21px/1.4 var(--ap-font-text);color:var(--ap-gray);margin:0 0 20px}
.ap-hero-actions{display:flex;gap:24px;justify-content:center;margin-bottom:40px}
.ap-hero-media{max-width:980px;width:100%;margin:0 auto;display:block}
```

Hero can sit on black (`#000` with `#f5f5f7` text) for a product launch; then the CTA blue
becomes `#2997ff`.

## 5. Inputs

```css
.ap-input,.ap-select,.ap-textarea{width:100%;font:400 17px/1.4 var(--ap-font-text);
  color:var(--ap-ink);background:var(--ap-white);border:1px solid var(--ap-hairline);
  border-radius:var(--ap-r-md);padding:12px 16px;
  transition:border-color var(--ap-dur-fast) var(--ap-ease),box-shadow var(--ap-dur-fast) var(--ap-ease)}
.ap-input::placeholder{color:var(--ap-gray-3)}
.ap-input:hover{border-color:#b8b8bd}
.ap-input:focus{outline:none;border-color:var(--ap-blue);
  box-shadow:0 0 0 4px rgba(0,113,227,.16)}
.ap-label{display:block;font:400 14px/1.4 var(--ap-font-text);color:var(--ap-gray);margin-bottom:6px}
.ap-hint{font:400 12px/1.4 var(--ap-font-text);color:var(--ap-gray-3);margin-top:6px}
.ap-error{font:400 12px/1.4 var(--ap-font-text);color:#e30000;margin-top:6px}
```

Filled variant (store checkout): `background:var(--ap-surface);border-color:transparent`, focus
adds the blue ring only.

## 6. Badge / chip / segmented control

```css
.ap-badge{display:inline-block;font:400 12px/1 var(--ap-font-text);padding:5px 10px;
  border-radius:var(--ap-r-xs);background:var(--ap-surface);color:var(--ap-gray)}
.ap-badge-new{background:rgba(0,113,227,.1);color:var(--ap-blue)}
.ap-chip{display:inline-flex;align-items:center;gap:6px;font:400 14px/1 var(--ap-font-text);
  padding:8px 14px;border-radius:var(--ap-r-pill);background:var(--ap-surface);
  color:var(--ap-ink);border:1px solid transparent;cursor:pointer}
.ap-chip[aria-selected="true"]{background:var(--ap-ink);color:#fff}
.ap-segmented{display:inline-flex;padding:2px;border-radius:var(--ap-r-pill);background:var(--ap-surface)}
.ap-segmented button{font:400 14px/1 var(--ap-font-text);padding:8px 16px;border:0;
  border-radius:var(--ap-r-pill);background:transparent;color:var(--ap-ink);cursor:pointer;
  transition:background-color var(--ap-dur-fast) var(--ap-ease)}
.ap-segmented button[aria-selected="true"]{background:var(--ap-white);box-shadow:var(--ap-shadow-1)}
```

## 7. Modal / sheet

```css
.ap-scrim{position:fixed;inset:0;background:rgba(0,0,0,.4);backdrop-filter:blur(2px)}
.ap-modal{position:relative;max-width:640px;margin:8vh auto;background:rgba(255,255,255,.92);
  backdrop-filter:saturate(180%) blur(20px);border-radius:var(--ap-r-xl);
  box-shadow:var(--ap-shadow-4);padding:40px}
.ap-modal-title{font:600 32px/1.15 var(--ap-font-display);letter-spacing:-.006em;margin:0 0 12px}
```

Mobile: sheet anchored to the bottom, radius `28px 28px 0 0`, no horizontal margins.

## 8. Footer

```css
.ap-footer{background:var(--ap-surface);color:var(--ap-gray-3);font:400 12px/1.5 var(--ap-font-text);
  padding:40px 24px 56px}
.ap-footer-cols{max-width:1024px;margin:0 auto;display:grid;gap:32px;
  grid-template-columns:repeat(auto-fit,minmax(160px,1fr))}
.ap-footer h4{font:600 12px/1.4 var(--ap-font-text);color:var(--ap-ink);margin:0 0 10px}
.ap-footer a{display:block;color:var(--ap-gray-3);text-decoration:none;padding:3px 0}
.ap-footer a:hover{color:var(--ap-ink);text-decoration:underline}
.ap-footer-legal{max-width:1024px;margin:24px auto 0;padding-top:16px;
  border-top:1px solid var(--ap-hairline)}
```

## 9. Section wrapper

```css
.ap-section{padding:76px 24px}
.ap-section-tight{padding:48px 24px}
.ap-container{max-width:1440px;margin:0 auto}
.ap-container-narrow{max-width:980px;margin:0 auto}
.ap-grid{display:grid;gap:24px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
.ap-section-title{font:600 40px/1.1 var(--ap-font-display);letter-spacing:-.009em;margin:0 0 8px}
.ap-section-sub{font:400 19px/1.42 var(--ap-font-text);color:var(--ap-gray);margin:0 0 40px}
```

Alternate section backgrounds white → `#f5f5f7` to create rhythm without borders.
