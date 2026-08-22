# NOVA — Engineered in the Open

A complete, cinematic **mobile shop** website built as a single static site. A
scroll-scrubbed hero product film plays forward as you scroll down and backward
as you scroll up, then the page settles into a real store: finishes, camera,
performance, an interactive charging demo, a gallery, specs, pricing, reviews,
FAQ, and a reservation form. Every section is animated.

Built to the principles of the **10k-websites** skill: blob-streamed hero with a
loading ring, frame-rate-independent scrub easing, gated seeks, a four-layer
text-legibility system, five live static-hero gates, complete-without-video
fallback, and a plain-language copy gate.

Plain HTML, CSS, and vanilla JavaScript. No build step, no framework.

## Run it locally

Video needs a real web server (not `file://`):

```bash
cd site
python3 -m http.server 8000    # then open http://localhost:8000
```

Use a normal browser. The clips are standard **H.264 / AAC** MP4s that every
real browser plays.

## What's on the page

| Section | Animation |
|---|---|
| Hero | Scroll-scrubbed product film (4 chapters: teardown → chip → display → reveal) with per-band caption entrances |
| Meet NOVA | Looping profile clip + spec ticker |
| Finishes | Three finish cards, each a looping clip |
| Camera | Dual looping clips + count-up stats |
| Power | Board clip + count-up stats |
| Architecture | Exploded clip with self-drawing SVG callout lines |
| Charge | **Press-and-hold** to fill the battery and light the charging ring |
| Details | Build-detail clip + feature list |
| Gallery | Three-clip motion grid |
| Specs / Pricing / Reviews / FAQ / Reserve | Scroll-reveal, pricing tiers, working reservation form (demo success state) |

## The footage (15 clips)

- `assets/videos/hero-scrub.mp4` — clips 01, 06, 04, 08 concatenated with
  crossfades and re-encoded with a short keyframe interval (`-g 8`) for smooth
  scrubbing.
- `assets/videos/loop-*.mp4` — the remaining clips, web-optimized for the
  section loops.
- `assets/hero-poster.jpg` / `hero-ending.jpg` — first and last hero frames.

Raw source clips are kept out of the deploy folder in `../review/raw-clips/`.

## Editing

- **Copy, prices, specs:** all in `index.html`, in plain text.
- **Hero chapters and captions:** the `.band` blocks near the top of
  `index.html` (each has a `data-range`, `data-entrance`, and its headline).
- **Colors / type:** CSS tokens at the top of `css/style.css`.
- **Swap a clip:** replace the file in `assets/videos/` (keep the name) or point
  a `data-src` / the hero encode at a new file.

## Notes

- NOVA is a **fictional brand** built to demonstrate the format; the phone,
  prices, specs, and reviews are invented and the footage is AI generated. The
  footer discloses this.
- The reservation form is a front-end demo: it shows a success state and stores
  nothing. To take real reservations, point it at a form service (e.g. Formspree)
  or a `mailto:` address.
- There is a faint "Veo" watermark in the lower-right of some source clips (the
  generator's mark); the stage vignette masks most of it.

## Deploy

Fully static — push the `site/` folder to any static host (Netlify, Vercel,
GitHub Pages, Hostinger, S3). Patch the `og:url` / `og:image` meta tags (marked
`DEPLOY STEP` in `index.html`) with the live URL after hosting.
