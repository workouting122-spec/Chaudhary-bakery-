# Meridian — A Cinematic Real-Estate Residence

A premium, scroll-driven real-estate experience where **scroll is the camera**.
The visitor doesn't read sections — they take a continuous cinematic walk-through
of a single residence, exterior → entrance → living → dining → kitchen → bedroom
→ bathroom → terrace, then amenities, the wider collection, location, trust and a
final call to action.

Built by transforming an existing Vite + React + TypeScript starter into a
one-continuous-journey property film.

## Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS** — custom architectural design system (charcoal + bone + a single
  brass accent; Fraunces display serif + Manrope sans, self-hosted)
- **GSAP + ScrollTrigger** — scroll choreography, parallax, scrubbed camera moves
  (code-split into its own chunk)
- **React Router** — `/`, `/residences`, `/contact`, 404
- No backend, no database, no auth — a fully **static** site.

## The cinematic system

- `src/components/cine/` — the environment layer. `Backdrop` renders a graded,
  self-contained architectural **scene** (layered gradients + generated SVG in
  `SceneArt.tsx`, `tones.ts`) finished with vignette + film grain. Every scene
  accepts an optional real photo/video via a `media` prop, so the generated art is
  pure placeholder and there are **no missing-asset 404s** out of the box.
- `src/components/scenes/` — the eight journey scenes (Opening, Brand,
  FeaturedIntro, **HouseTour**, Amenities, Collection, Location, Trust, FinalCTA).
- `HouseTour` is the spine: a pinned, sticky stage where scroll position drives a
  ken-burns "camera" and crossfades room to room. Reduced-motion renders a clean
  stacked sequence instead.
- `src/components/ui/CameraTimeline.tsx` — the fixed rail expressing
  scroll-as-camera-position (and chapter navigation).
- `src/components/ui/Reveal.tsx` — entrance animations (mask / scale / clip — not
  generic fades), robust to jump-navigation and `prefers-reduced-motion`.

## Editing content (no code needed)

- **Brand, contact, map** → `src/config/site.ts`
- **The featured house + tour rooms** → `src/data/residence.ts`
- **The wider collection** → `src/data/collection.ts`
- **Amenities, location, trust, testimonials** → `src/data/site-content.ts`

> Trust statistics ship as `—` placeholders on purpose — replace them with real,
> verifiable figures. Do not publish invented numbers.

## Real photography & video

Drop files into `public/assets/…` and point a data item's `media` field at them
(e.g. `media: "/assets/tour/living.jpg"`). See `public/assets/README.txt`.
For video scenes, pass `video` alongside `media`. Until then, the generated scenes
render.

## Develop

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # tsc -b && vite build  → dist/
npm run preview   # serve the production build
```

## Deploy (static)

Output is a static `dist/`. SPA fallbacks are configured for **Netlify**
(`netlify.toml`, `public/_redirects`) and **Vercel** (`vercel.json`). Any static
host works — publish `dist/`.

## Accessibility & performance

- Semantic landmarks, skip link, keyboard-navigable nav/forms, visible focus.
- Full `prefers-reduced-motion` support (scenes swap camera moves for static
  compositions).
- Route-level code splitting; GSAP in its own chunk; self-hosted fonts; lazy media.

## Tooling notes

- **UI/UX Pro Max** design skill was used as the design authority throughout.
- **21st.dev MCP** is configured in `.mcp.json` (via the `API_KEY_21ST` env var) but
  was **not reachable from the build environment** (host blocked by network egress
  policy), so all interactive effects here are custom React/CSS/GSAP — no component
  was pulled from it, and none is claimed to be.
