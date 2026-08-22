# NOVA — Scroll-Driven Product Film

A cinematic, scroll-driven website. Each video clip becomes a **chapter** that
"scrubs" frame-by-frame as you scroll — the further you scroll through a section,
the further the clip plays. Built as a plain static site (no build step), so it
runs anywhere and deploys to any host.

This is the **starter** version wired with the first **5 clips**. It's designed
so clips **06–15** drop in with almost no work.

## Run it locally

Because browsers stream video with HTTP *range* requests, open it through a real
web server (not `file://`):

```bash
cd site
python3 -m http.server 8000
# then open http://localhost:8000
```

> Note: use a normal browser (Chrome, Safari, Firefox, Edge). The clips are
> standard **H.264 / AAC** MP4s, which every real browser plays. (Some headless
> test browsers ship without the H.264 decoder — that's a test-tool limitation,
> not the site.)

## Add clips 06–15 (the whole point)

1. Drop the video into `site/assets/videos/` named `clip-06.mp4`, `clip-07.mp4`, …
2. Open `site/js/clips.js` and add **one entry** per clip to the `CLIPS` array:

```js
{
  src:   "assets/videos/clip-06.mp4",
  label: "Optics",              // short tag shown in the side nav + chapter chip
  title: "The camera, reimagined.",  // big headline over the clip
  copy:  "A sensor that sees more light.", // one-line caption
  scrub: true,                  // true = scrub with scroll (cinematic)
  length: 2.8,                  // scroll length in screen-heights (optional)
},
```

That's it — order in the array is the order on the page. No other file changes.

## Fields reference

| Field    | Meaning |
|----------|---------|
| `src`    | Path to the video file |
| `label`  | Short name in side nav / chapter chip |
| `title`  | Headline that fades in over the clip |
| `copy`   | Supporting one-liner (optional) |
| `scrub`  | `true` = video timeline follows scroll · `false` = clip just autoplays/loops while on screen |
| `length` | Section height in viewport-heights (default `2.6`). Bigger = slower, more scroll per clip |

## How it works

- Each clip gets a tall section with a **pinned** full-screen stage.
- As you scroll through that section, the clip's `currentTime` is eased toward a
  target derived from scroll position (smooth, buttery scrubbing via rAF).
- Only the active clip (± its neighbours) is kept in memory, so adding many
  clips stays performant.
- A top progress bar, per-clip scrub bar, side-chapter nav, and reduced-motion
  support are all included.

## File map

```
site/
├── index.html         # shell: hero, chapters mount point, outro
├── css/style.css      # all styling / animation
├── js/clips.js        # ← EDIT THIS to add clips
├── js/main.js         # scroll + scrub engine (rarely need to touch)
└── assets/videos/     # clip-01.mp4 … clip-15.mp4
```

## Deploy

It's fully static — push `site/` to any static host (Netlify, Vercel, GitHub
Pages, Hostinger, S3+CloudFront, etc.). No server code required.
