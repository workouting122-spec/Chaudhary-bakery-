# Aethera — A New Kind of Intelligence

A full-viewport video hero landing page built with React + Vite (JSX).

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Required asset: `public/hero.mp4`

The hero background is a looping video served locally from `public/hero.mp4`.
This file is **not** committed — download it once and drop it in `public/`:

```bash
mkdir -p public
curl -L -o public/hero.mp4 \
  "https://pub-1e5b4001b36b47e28e6a2fb775966a79.r2.dev/templates/aethera/hero.mp4"
```

The video is referenced only as the root-relative path `/hero.mp4` in code
(`src/components/Hero.jsx` and the `<link rel="preload">` in `index.html`).
Serve it from your own hosting alongside the rest of the project — do not
hotlink the template library's storage in production.

## Structure

```
index.html
vite.config.js
public/favicon.svg
public/hero.mp4          (add this yourself — see above)
src/main.jsx
src/App.jsx
src/styles/globals.css
src/components/Navbar.jsx + Navbar.css
src/components/Hero.jsx + Hero.css
src/components/icons.jsx
```
