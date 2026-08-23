import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Backdrop from "@/components/cine/Backdrop";
import { site, telLink } from "@/config/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * SCENE — Final CTA. A slow push-in on the exterior at dusk as the closing
 * line clip-reveals; the journey ends where it began, outside the house.
 */
export default function FinalCTA() {
  const root = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const plate = root.current?.querySelector<HTMLElement>("[data-parallax]");
      if (plate) {
        gsap.fromTo(
          plate,
          { scale: 1.02 },
          {
            scale: 1.2,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      }
      return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section id="cta" ref={root} className="relative flex min-h-[100svh] items-center overflow-hidden">
      <Backdrop tone="dusk" variant="exterior" dim={0.5} />
      <div className="container-x relative z-10 text-center">
        <p className="eyebrow mb-6">{site.established}</p>
        <h2 className="mx-auto max-w-4xl text-display-lg text-shadow-cine">
          The house is waiting.
          <br />
          <span className="italic text-brass">Come and walk it for real.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base text-bone-soft">
          Private viewings are arranged one household at a time, by appointment.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button onClick={() => navigate(site.primaryCta.href)} className="btn-primary">
            {site.primaryCta.label}
          </button>
          <a href={telLink()} className="btn-ghost">
            Call {site.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
