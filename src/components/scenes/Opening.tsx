import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Backdrop from "@/components/cine/Backdrop";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import { site } from "@/config/site";
import { featured } from "@/data/residence";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { isVideo } from "@/lib/utils";

export default function Opening() {
  const root = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const content = root.current?.querySelector<HTMLElement>("[data-hero-content]");

      // The clip carries its own camera move, so the frame stays still (no zoom).
      // Only the title lifts and fades as we scroll past the opening.
      if (content) {
        gsap.to(content, {
          yPercent: -22,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
        });
      }

      // entrance: title clip-reveal on load
      gsap.from("[data-title-line]", {
        yPercent: 120,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.15,
      });
      gsap.from("[data-hero-fade]", {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power2.out",
        stagger: 0.15,
        delay: 0.7,
      });

      return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section id="top" ref={root} className="relative h-[100svh] w-full overflow-hidden">
      <Backdrop tone="dusk" variant="exterior" media={featured.media} video={isVideo(featured.media)} alt={featured.name} dim={0.42} />

      <div
        data-hero-content
        className="relative z-10 flex h-full flex-col justify-end pb-[12vh] sm:justify-center sm:pb-0"
      >
        <div className="container-x">
          <p data-hero-fade className="eyebrow mb-6 text-shadow-cine">
            {featured.status} · {featured.location}
          </p>

          <h1 className="text-display-xl text-bone text-shadow-cine">
            <span className="block overflow-hidden">
              <span data-title-line className="block">
                A residence you
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-title-line className="block italic text-brass">
                walk by scrolling.
              </span>
            </span>
          </h1>

          <p data-hero-fade className="mt-8 max-w-reading text-base leading-relaxed text-bone-soft sm:text-lg">
            {featured.blurb}
          </p>

          <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-4">
            <button onClick={() => navigate(site.primaryCta.href)} className="btn-primary">
              {site.primaryCta.label}
            </button>
            <button
              onClick={() => document.getElementById("tour")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-ghost"
            >
              {site.secondaryCta.label}
            </button>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-8 z-10 hidden justify-center sm:flex">
        <ScrollIndicator />
      </div>
    </section>
  );
}
