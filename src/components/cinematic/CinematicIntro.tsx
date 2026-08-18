import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * The opening beat of the brand film — "Born from chocolate". A quiet, almost
 * still frame that establishes the dark chocolate world before the scrubbed
 * chapters begin. (Blueprint §01 — Cinematic Intro.)
 */
export default function CinematicIntro() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".intro-line", { y: 34, autoAlpha: 0, duration: 1, stagger: 0.14 }, 0.2)
        .from(".intro-cue", { autoAlpha: 0, duration: 0.8 }, "-=0.3");

      // A slow parallax drift out as the first chapter takes over.
      gsap.to(".intro-brand", {
        yPercent: -18,
        autoAlpha: 0.15,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section
      ref={root}
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-choc-950"
      aria-label="Chaudhary Bake & Cake — born from chocolate"
    >
      <video
        className="absolute inset-0 h-full w-full bg-choc-950 object-cover opacity-40"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/assets/clip-01-origin.mp4" type="video/mp4" />
      </video>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_45%,rgba(18,10,6,0.35)_30%,rgba(12,7,4,0.9)_100%)]"
        aria-hidden="true"
      />

      <div className="intro-brand relative z-10 px-6 text-center">
        <p className="intro-line eyebrow mb-6 !tracking-[0.4em] !text-gold-soft">
          Chaudhary Bake &amp; Cake
        </p>
        <h1 className="intro-line font-display text-[clamp(2.75rem,9vw,6.5rem)] font-normal leading-[0.98] text-cream-50">
          Born from
          <span className="block italic text-gold">chocolate.</span>
        </h1>
        <p className="intro-line mx-auto mt-7 max-w-md text-base text-cream-200/80 sm:text-lg">
          A short film about one cake — from molten cocoa to the finished
          showpiece.
        </p>
      </div>

      <div className="intro-cue absolute bottom-9 left-1/2 z-10 -translate-x-1/2 text-center">
        <div className="mx-auto h-12 w-px origin-top animate-scroll-line bg-cream-50/50" />
        <span className="eyebrow mt-3 block !text-[10px] !text-cream-50/60">scroll to begin</span>
      </div>
    </section>
  );
}
