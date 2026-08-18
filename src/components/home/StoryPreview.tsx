import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/config/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function StoryPreview() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.to(".story-img", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section ref={root} className="bg-cream-200 py-20 md:py-28">
      <div className="container-x grid items-center gap-12 md:grid-cols-2">
        <div>
          <p className="eyebrow mb-3">Our story</p>
          <h2 className="font-display text-display-md">
            Family recipes. Baked fresh. Every morning.
          </h2>
          <p className="mt-6 max-w-prose text-ink-soft">
            Chaudhary Bake &amp; Cake has been serving {site.neighborhood} since {site.sinceYear}.
            Every cake is baked eggless in our own kitchen using premium ingredients. From birthday
            celebrations to quiet Sunday afternoons — we bake for the moments that matter.
          </p>
          <Link to="/about" className="btn-gold mt-8">
            Read our story →
          </Link>
        </div>
        <div className="relative h-80 overflow-hidden rounded-2xl shadow-soft md:h-[28rem]">
          <img
            src="/assets/frame-04-final-decorated.png"
            alt="Chaudhary Bake & Cake"
            loading="lazy"
            className="story-img absolute inset-0 h-[120%] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
