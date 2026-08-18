import CinematicIntro from "./CinematicIntro";
import CinematicChapter, { type ChapterConfig } from "./CinematicChapter";

/**
 * The eight-chapter brand film. Scroll scrubs each clip's playhead while the
 * editorial UI is choreographed in the safe zone — text, CTA, logo and progress
 * always live in HTML above the video, never baked into it. (Blueprint §01–12.)
 */
const chapters: ChapterConfig[] = [
  {
    index: 1,
    total: 8,
    eyebrow: "01 — The Origin",
    headline: (
      <>
        Every masterpiece
        <br />
        begins with chocolate.
      </>
    ),
    body: "Pure dark cocoa, slowly tempered into something unforgettable.",
    small: "Scroll to discover",
    video: { src: "/assets/clip-01-origin.mp4" },
    zone: "upper-left",
  },
  {
    index: 2,
    total: 8,
    eyebrow: "02 — The Foundation",
    headline: (
      <>
        From chocolate,
        <br />a foundation.
      </>
    ),
    body: "A rich dark-chocolate sponge, finished with a smooth ganache layer.",
    video: { src: "/assets/clip-02-foundation.mp4" },
    zone: "right",
  },
  {
    index: 3,
    total: 8,
    eyebrow: "03 — The Craft",
    headline: "Layered with intention.",
    body: "Three rich chocolate sponge layers, separated by smooth ganache.",
    video: { src: "/assets/clip-03-craft.mp4" },
    zone: "left",
    objectPosition: "center 40%",
  },
  {
    index: 4,
    total: 8,
    eyebrow: "04 — The Finish",
    headline: (
      <>
        Finished in
        <br />
        dark chocolate.
      </>
    ),
    body: "A mirror-smooth ganache, poured warm and left to fall in slow, glossy drips.",
    video: { src: "/assets/clip-04-finish.mp4" },
    zone: "upper-left",
  },
  {
    index: 5,
    total: 8,
    eyebrow: "05 — The Details",
    headline: "Details make the difference.",
    body: "Finished with tempered chocolate shards, fresh berries and a touch of gold.",
    video: { src: "/assets/clip-05-details.mp4" },
    zone: "lower-left",
  },
  {
    index: 6,
    total: 8,
    eyebrow: "06 — The Showpiece",
    headline: (
      <>
        Born from chocolate.
        <br />
        Crafted for the moments
        <br />
        worth remembering.
      </>
    ),
    video: { src: "/assets/hero-360-cake.mp4", mobileSrc: "/assets/hero-360-cake-mobile.mp4" },
    zone: "left",
    // Text clears early so the finished cake dominates the final orbit.
    contentOutAt: 0.5,
    scroll: 2.6,
  },
  {
    index: 7,
    total: 8,
    eyebrow: "07 — The Signature",
    headline: (
      <>
        Chaudhary
        <span className="block italic text-gold">Bake &amp; Cake</span>
      </>
    ),
    body: "Handcrafted chocolate cakes, baked fresh and made to order.",
    video: { src: "/assets/clip-04-finish.mp4" },
    zone: "center",
    objectPosition: "center 30%",
  },
  {
    index: 8,
    total: 8,
    eyebrow: "08 — Your Moment",
    headline: "Your moment, made in chocolate.",
    body: "Order a signature cake, or design your own for the day that matters.",
    cta: { label: "Shop Cakes", to: "/shop" },
    video: { src: "/assets/hero-360-cake.mp4", mobileSrc: "/assets/hero-360-cake-mobile.mp4" },
    zone: "center",
  },
];

export default function CinematicJourney() {
  return (
    <div className="relative bg-choc-950">
      <CinematicIntro />
      {chapters.map((c) => (
        <CinematicChapter key={c.index} {...c} />
      ))}
    </div>
  );
}
