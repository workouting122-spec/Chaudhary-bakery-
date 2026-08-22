/* ============================================================
   CLIP CONFIG  —  the ONLY file you edit to add more clips.
   ------------------------------------------------------------
   To add a new clip:
     1. Drop the video in  site/assets/videos/  (e.g. clip-06.mp4)
     2. Add one entry to the array below.
   Order in this array = order on the page.

   Fields:
     src      : path to the video file
     label    : short name shown in the side nav / chapter tag
     title    : big headline that fades in over the clip
     copy     : one-line supporting caption
     scrub    : true  -> video scrubs frame-by-frame with scroll (cinematic)
                false -> video simply autoplays while its section is on screen
     length   : scroll length of the section in viewport-heights (default 2.6)
   ============================================================ */

window.CLIPS = [
  {
    src: "assets/videos/clip-01.mp4",
    label: "Genesis",
    title: "It begins as an idea.",
    copy: "Every surface, considered. Every edge, intentional.",
    scrub: true,
    length: 2.8,
  },
  {
    src: "assets/videos/clip-02.mp4",
    label: "Assembly",
    title: "Built from the inside out.",
    copy: "Precision architecture, layer by layer.",
    scrub: true,
    length: 3.0,
  },
  {
    src: "assets/videos/clip-03.mp4",
    label: "Continuum",
    title: "Motion without seams.",
    copy: "A single continuous gesture from part to whole.",
    scrub: true,
    length: 2.8,
  },
  {
    src: "assets/videos/clip-04.mp4",
    label: "Display",
    title: "Light meets glass.",
    copy: "A display engineered to disappear into the image.",
    scrub: true,
    length: 2.8,
  },
  {
    src: "assets/videos/clip-05.mp4",
    label: "Reveal",
    title: "Meet NOVA.",
    copy: "The finished product, in full.",
    scrub: true,
    length: 3.2,
  },

  /* --- Clips 06–15 go here when you upload them ---
  { src: "assets/videos/clip-06.mp4", label: "…", title: "…", copy: "…", scrub: true },
  { src: "assets/videos/clip-07.mp4", label: "…", title: "…", copy: "…", scrub: true },
  ... up to clip-15
  */
];
