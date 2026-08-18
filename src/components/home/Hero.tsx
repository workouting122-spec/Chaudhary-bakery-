import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import { site } from "@/config/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-video", { autoAlpha: 0, duration: 0.8 })
        .from(".hero-line", { y: 24, autoAlpha: 0, stagger: 0.1, duration: 0.7 }, "-=0.4")
        .from(".hero-scroll", { autoAlpha: 0, duration: 0.6 }, "-=0.2");
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section
      ref={root}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      aria-label="Chaudhary Bake and Cake hero"
    >
      {/* Centred rotating hero cake */}
      <video
        className="hero-video h-[62vh] w-auto max-w-[92vw] object-contain drop-shadow-[0_40px_50px_rgba(43,38,34,0.28)] md:h-[70vh]"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/assets/frame-04-final-decorated.png"
        aria-label="A finished two-tier white cake with gold leaf and a white orchid, slowly rotating"
      >
        <source src="/assets/hero-360-cake.mp4" type="video/mp4" />
      </video>

      {/* Overlaid brand text, upper-left */}
      <div className="pointer-events-none absolute left-5 top-[calc(var(--nav-h)+3vh)] sm:left-10 md:top-[calc(var(--nav-h)+6vh)]">
        <h1 className="leading-[0.92]">
          <span className="hero-line block font-display text-display-lg font-normal">Chaudhary</span>
          <span className="hero-line ml-6 block font-display text-display-lg font-normal italic text-brand sm:ml-12">
            Bake &amp; Cake
          </span>
        </h1>
        <p className="hero-line eyebrow mt-4 ml-1">
          {site.tagline} · Since {site.sinceYear}
        </p>
      </div>

      {/* Scroll cue */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2">
        <ScrollIndicator />
      </div>
    </section>
  );
}
