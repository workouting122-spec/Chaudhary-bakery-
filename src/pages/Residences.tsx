import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Backdrop from "@/components/cine/Backdrop";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { featured } from "@/data/residence";
import { collection } from "@/data/collection";

/** A calm, editorial index of the full portfolio (featured + collection). */
export default function Residences() {
  const all = [featured, ...collection];
  return (
    <div>
      <div className="relative flex min-h-[42vh] items-end overflow-hidden pt-24">
        <Backdrop tone="dusk" variant="exterior" dim={0.45} />
        <div className="container-x relative z-10 pb-12">
          <p className="eyebrow mb-4">The portfolio</p>
          <h1 className="text-display-lg">Residences</h1>
        </div>
      </div>

      <div className="container-x py-16">
        <SectionHeading
          eyebrow="Currently"
          title="A small, deliberate collection."
          intro="Each residence is designed and released one at a time. Enquire for private details and pricing."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((r, i) => (
            <Reveal
              key={r.id}
              variant="mask"
              delay={i * 80}
              as="article"
              className="group relative aspect-[4/5] overflow-hidden rounded-lg"
            >
              <div className="absolute inset-0 transition-transform duration-700 ease-smooth group-hover:scale-105">
                <Backdrop tone={r.tone} variant={r.tone === "garden" ? "landscape" : "exterior"} dim={0.4} grain={false} />
              </div>
              <div className="absolute inset-0 z-10 flex flex-col justify-between p-6">
                <span className="plate self-start px-3 py-1 text-[10px] uppercase tracking-widest text-bone">
                  {r.status}
                </span>
                <div>
                  <p className="text-xs uppercase tracking-widest text-brass">{r.location}</p>
                  <h3 className="mt-1 font-display text-2xl text-bone">{r.name}</h3>
                  <div className="mt-3 flex gap-3 text-xs text-bone-muted">
                    <span>{r.beds}</span>
                    <span>{r.baths}</span>
                    <span>{r.area}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-bone/10 pt-10">
          <p className="font-display text-2xl text-bone">Ready to see one in person?</p>
          <Link to="/contact" className="btn-primary">
            Book a Private Viewing <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
