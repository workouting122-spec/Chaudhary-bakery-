import Backdrop from "@/components/cine/Backdrop";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { amenities } from "@/data/site-content";
import { isVideo } from "@/lib/utils";

/**
 * SCENE — Amenities. Not a card grid: an asymmetric editorial mosaic of tall
 * image panels, each revealing with a clip wipe and lifting its label on hover.
 */
export default function Amenities() {
  return (
    <section id="amenities" className="bg-ink-950 py-[16vh]">
      <div className="container-x">
        <SectionHeading
          eyebrow="Beyond the rooms"
          title="Amenities kept deliberately few, deliberately generous."
          intro="Everything here earns its place. No feature is listed twice; nothing is filler."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-12">
          {amenities.map((a, i) => {
            // asymmetric spans so the mosaic never reads as a uniform grid
            const layouts = [
              "md:col-span-7 aspect-[16/11]",
              "md:col-span-5 aspect-[4/5]",
              "md:col-span-5 aspect-[4/5]",
              "md:col-span-7 aspect-[16/11]",
            ];
            return (
              <Reveal
                key={a.title}
                variant="mask"
                delay={i * 90}
                className={`group relative overflow-hidden rounded-lg ${layouts[i % 4]}`}
              >
                <Backdrop tone={a.tone} variant={i % 2 === 0 ? "interior" : "landscape"} media={a.media} video={isVideo(a.media)} alt={a.title} dim={0.4} grain={false} />
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-7">
                  <h3 className="font-display text-2xl text-bone text-shadow-cine transition-transform duration-500 ease-smooth group-hover:-translate-y-1">
                    {a.title}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-bone-soft opacity-90">
                    {a.copy}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
