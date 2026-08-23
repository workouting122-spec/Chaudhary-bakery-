import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Backdrop from "@/components/cine/Backdrop";
import SectionHeading from "@/components/ui/SectionHeading";
import { collection } from "@/data/collection";
import { clamp, isVideo } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Residence } from "@/types";

/**
 * SCENE — Property Collection. Desktop pins a stage and converts vertical
 * scroll into horizontal camera travel across the residences (sticky + rAF, no
 * GSAP pin — robust across StrictMode/resizes). Mobile & reduced-motion fall
 * back to an accessible native horizontal snap-scroll.
 */
export default function Collection() {
  const reduced = useReducedMotion();
  const [horizontal, setHorizontal] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setHorizontal(mq.matches && !reduced);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [reduced]);

  return horizontal ? <Pinned /> : <Native />;
}

function Pinned() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [sectionH, setSectionH] = useState("300vh");

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const distance = track.scrollWidth - window.innerWidth;
      setSectionH(`${Math.max(distance, 0) + window.innerHeight}px`);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const total = section.offsetHeight - window.innerHeight;
      const scrolled = clamp(-section.getBoundingClientRect().top, 0, total);
      const progress = total > 0 ? scrolled / total : 0;
      const distance = track.scrollWidth - window.innerWidth;
      track.style.transform = `translate3d(${-progress * distance}px,0,0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="collection" ref={sectionRef} className="relative bg-ink-900" style={{ height: sectionH }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center gap-[4vh] overflow-hidden pb-[4vh] pt-[calc(var(--nav-h)+2vh)]">
        <div className="container-x">
          <SectionHeading eyebrow="The wider portfolio" title="Four more residences, each its own world." />
        </div>
        <div ref={trackRef} className="flex items-stretch gap-6 px-5 will-change-transform sm:px-8 lg:px-12">
          {collection.map((r) => (
            <CollectionCard key={r.id} r={r} className="h-[52vh] shrink-0" />
          ))}
          <div className="flex w-[38vw] max-w-[320px] shrink-0 items-center">
            <p className="font-display text-xl text-bone-muted">
              Enquire for the full private portfolio →
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Native() {
  return (
    <section id="collection" className="bg-ink-900 py-[14vh]">
      <div className="container-x">
        <SectionHeading eyebrow="The wider portfolio" title="Four more residences, each its own world." />
      </div>
      <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {collection.map((r) => (
          <CollectionCard key={r.id} r={r} className="w-[82vw] max-w-[420px] shrink-0 snap-start" />
        ))}
      </div>
    </section>
  );
}

function CollectionCard({ r, className }: { r: Residence; className?: string }) {
  return (
    <article className={`group relative aspect-[3/4] overflow-hidden rounded-lg ${className ?? ""}`} style={{ aspectRatio: "3 / 4" }}>
      <div className="absolute inset-0 transition-transform duration-700 ease-smooth group-hover:scale-105">
        <Backdrop tone={r.tone} variant={r.tone === "garden" ? "landscape" : "exterior"} media={r.media} video={isVideo(r.media)} alt={r.name} dim={0.4} grain={false} />
      </div>
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          <span className="plate px-3 py-1 text-[10px] uppercase tracking-widest text-bone">
            {r.status}
          </span>
          <ArrowUpRight className="text-bone opacity-0 transition group-hover:opacity-100" size={22} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-brass">{r.location}</p>
          <h3 className="mt-1 font-display text-3xl text-bone text-shadow-cine">{r.name}</h3>
          <p className="mt-2 text-sm text-bone-soft">{r.blurb}</p>
          <div className="mt-4 flex gap-4 text-xs text-bone-muted">
            <span>{r.beds}</span>
            <span>{r.baths}</span>
            <span>{r.area}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
