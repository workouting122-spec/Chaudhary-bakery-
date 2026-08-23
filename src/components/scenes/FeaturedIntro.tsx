import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Backdrop from "@/components/cine/Backdrop";
import { featured } from "@/data/residence";
import { isVideo } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * SCENE — Featured Property. The house is "discovered": a masked plate opens
 * (clip-path wipe) while the frame scales down from an over-zoom, revealing the
 * name and headline specs. Acts as the title card before the room tour.
 */
export default function FeaturedIntro() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const frame = root.current?.querySelector<HTMLElement>("[data-frame]");
      if (!frame) return;

      // A clip-path wipe reveals the frame — no scaling of the video itself.
      gsap.fromTo(
        frame,
        { clipPath: "inset(12% 12% 12% 12% round 8px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 8px)",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 80%", end: "top 20%", scrub: 0.5 },
        }
      );

      gsap.from("[data-spec]", {
        y: 24,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: "[data-spec-row]", start: "top 85%" },
      });
      return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    },
    { scope: root, dependencies: [reduced] }
  );

  const specs = [
    { label: "Bedrooms", value: featured.beds.replace(" Bedrooms", "") },
    { label: "Bathrooms", value: featured.baths.replace(" Bathrooms", "") },
    { label: "Internal area", value: featured.area },
    { label: "Status", value: featured.status },
  ];

  return (
    <section className="relative bg-ink-900 py-[14vh]">
      <div ref={root} className="container-x">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-4">The featured residence</p>
            <h2 className="text-display-lg">{featured.name}</h2>
            <p className="mt-3 text-bone-muted">{featured.location}</p>
          </div>
          <p className="font-display text-2xl text-brass">{featured.price}</p>
        </div>

        <div
          data-frame
          className="relative aspect-[16/10] w-full overflow-hidden rounded-lg sm:aspect-[21/9]"
        >
          <Backdrop tone={featured.tone} variant="exterior" media={featured.media} video={isVideo(featured.media)} alt={featured.name} dim={0.3} />
          <div className="absolute bottom-6 left-6 z-10">
            <p className="font-display text-xl text-bone text-shadow-cine sm:text-2xl">
              Begin the walk-through below
            </p>
          </div>
        </div>

        <div data-spec-row className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-bone/10 bg-bone/10 sm:grid-cols-4">
          {specs.map((s) => (
            <div data-spec key={s.label} className="bg-ink-900 p-6">
              <p className="font-display text-2xl text-bone">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-bone-faint">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
