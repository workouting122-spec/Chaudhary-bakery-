import { useRef } from "react";
import { MapPin } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Backdrop from "@/components/cine/Backdrop";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { landmarks, locationMedia } from "@/data/site-content";
import { site } from "@/config/site";
import { featured } from "@/data/residence";
import { isVideo } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * SCENE — Location. A parallaxed landscape sits behind the connectivity list;
 * the horizon drifts under the content as it scrolls (layered depth).
 */
export default function Location() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const plate = root.current?.querySelector<HTMLElement>("[data-parallax]");
      if (plate) {
        gsap.fromTo(
          plate,
          { yPercent: -8 },
          {
            yPercent: 8,
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
    <section id="location" ref={root} className="relative overflow-hidden py-[16vh]">
      <Backdrop tone="dawn" variant="landscape" media={locationMedia} video={isVideo(locationMedia)} alt="Aerial view of the setting" dim={0.55} parallax />
      <div className="container-x relative z-10">
        <SectionHeading
          eyebrow="The setting"
          title="Held above the valley, minutes from everything that matters."
          intro={featured.location + "."}
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-bone/10 bg-bone/10 sm:grid-cols-3">
            {landmarks.map((l, i) => (
              <Reveal key={l.name} as="li" variant="rise" delay={i * 60} className="bg-ink-900/80 p-6 backdrop-blur-sm">
                <p className="font-display text-2xl text-brass">{l.distance}</p>
                <p className="mt-2 text-sm text-bone">{l.name}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-widest text-bone-faint">{l.kind}</p>
              </Reveal>
            ))}
          </ul>

          <Reveal variant="mask" className="relative min-h-[320px] overflow-hidden rounded-lg border border-bone/10">
            {site.address.mapEmbedSrc ? (
              <iframe
                title="Location map"
                src={site.address.mapEmbedSrc}
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="absolute inset-0">
                <Backdrop tone="night" variant="landscape" dim={0.35} grain={false} />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                  <MapPin className="text-brass" size={28} />
                  <p className="font-display text-xl text-bone">{site.address.line1}</p>
                  <p className="text-sm text-bone-muted">{site.address.line2}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-bone-faint">
                    Add a Google Maps embed in site.ts
                  </p>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
