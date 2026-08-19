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

Loaded via CDN + import map — **no build step**.

## Run locally

Because it uses ES modules, serve over HTTP (not `file://`):

```bash
cd iphone17
python3 -m http.server 8080      # or: npx serve .
# open http://localhost:8080
```

## Deploy

Any static host (GitHub Pages, Netlify, Vercel). Point it at the `iphone17/`
folder — `index.html` is the entry.

## Performance & resilience

- Capped device-pixel-ratio, additive particle blending, temp-vector reuse (no per-frame GC churn)
- Rendering pauses when the tab is hidden
- Reduced-motion aware; graceful fallback messaging if WebGL / CDN libs are unavailable
- Fully responsive (desktop + mobile layouts)

> Demo project. iPhone 17 Pro Max, A19 Pro and titanium finishes shown are
> illustrative and not affiliated with Apple Inc.
