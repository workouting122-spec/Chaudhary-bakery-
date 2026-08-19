# iPhone 17 Pro Max — Scroll-Driven 3D Landing

A high-end, Apple-style interactive shop landing page. The iPhone 17 Pro Max is
built procedurally in Three.js and **deconstructs on scroll** — titanium frame,
A19 Pro chip, vapor-chamber cooling, multilayer motherboard, periscope camera,
battery and OLED display separate, tour, and snap back together, all pinned
behind glassmorphism content.

## Experience map

| Scroll section | Camera | 3D behaviour |
|---|---|---|
| **Hero** | Straight-on, 38° | Complete phone floats + subtly rotates under studio light |
| **Teardown** | Top-right isometric | 7 layers explode apart in 3D space |
| **Camera** | Close on periscope | Tetraprism telephoto highlighted with floating specs |
| **A19 Pro** | Rotated into the board | Chip glows/pulses, circuit particles + accent light |
| **Colors** | Gentle orbit | Parts reassemble; live titanium finish swapping |
| **Buy / CTA** | Parked to the side | Glass pre-order cards + shop footer |

## Tech

- **Three.js 0.160** (procedural model, PBR titanium, `RoomEnvironment` reflections)
- **GSAP + ScrollTrigger** (scroll-synced overlays, finish tweens)
- **Lenis** (inertia smooth scroll)
- Damped, interpolated camera/layer motion — scroll expresses *intention*, not raw frames
- OLED dark (`#050505`), glassmorphism UI, Inter (SF-alternative) typography

Libraries are vendored locally in `vendor/` and wired via an import map —
**no build step, no runtime CDN**.

## Project structure

Everything lives at the **repository root** (no wrapper folder), so any static
host serves it directly:

```
index.html          ← entry (must stay at root)
css/styles.css
js/                 ← config, scene, phone, scroll, ui, main (ES modules)
vendor/             ← three.js, gsap, lenis (bundled locally)
package.json        ← static-site scripts (dev / build / pack)
scripts/            ← serve.js, build.js, pack.sh
```

## Run locally

It uses ES modules, so it must be served over HTTP (not opened as `file://`):

```bash
npm run dev          # zero-dependency static server → http://localhost:8080
# or: python3 -m http.server 8080
```

## Build & package

```bash
npm run build        # copies the site into ./dist (index.html at dist root)
npm run pack         # creates iphone17-pro-max-deploy.zip (index.html at zip root)
```

## Deploy to Hostinger (or any static host)

`index.html` sits at the project root — **upload the root contents directly**
(or the generated `dist/`), not a wrapping folder.

- **Hostinger (file manager / hPanel):** run `npm run pack`, then upload
  `iphone17-pro-max-deploy.zip` into `public_html` and extract there. The
  archive's `index.html` is at its root, so no nested-folder errors.
- **Hostinger Git / auto-deploy:** `package.json` marks it as a static
  project; set the publish directory to the repo root (or `dist` if a build
  step is run).
- **GitHub Pages / Netlify / Vercel:** point the publish directory at the repo
  root (build command optional: `npm run build`, output `dist`).

## Performance & resilience

- Capped device-pixel-ratio, additive particle blending, temp-vector reuse (no per-frame GC churn)
- Rendering pauses when the tab is hidden
- Reduced-motion aware; graceful fallback messaging if WebGL / CDN libs are unavailable
- Fully responsive (desktop + mobile layouts)

> Demo project. iPhone 17 Pro Max, A19 Pro and titanium finishes shown are
> illustrative and not affiliated with Apple Inc.
