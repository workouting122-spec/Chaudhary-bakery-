import { useEffect, useRef, useState } from "react";
import Backdrop from "@/components/cine/Backdrop";
import { tour } from "@/data/residence";
import { clamp, isVideo } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ArtVariant } from "@/components/cine/SceneArt";

/** Choose architectural art per room so each stop reads distinctly. */
const variantFor = (room: string): ArtVariant => {
  const r = room.toLowerCase();
  if (r.includes("exterior")) return "exterior";
  if (r.includes("entrance")) return "aperture";
  if (r.includes("terrace") || r.includes("balcony")) return "landscape";
  return "interior";
};

/**
 * SCENE — The House Tour (the spine of the whole site).
 * A tall track pins a full-viewport stage; scroll position is the camera,
 * moving room to room. Backdrops crossfade while the active plate performs a
 * continuous ken-burns move (driven imperatively for 60fps, no re-render).
 * Reduced motion → a clean stacked sequence with no pin or transforms.
 */
export default function HouseTour() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const total = section.offsetHeight - window.innerHeight;
      const scrolled = clamp(-section.getBoundingClientRect().top, 0, total);
      const progress = total > 0 ? scrolled / total : 0;
      const scaled = progress * tour.length;
      const idx = clamp(Math.floor(scaled), 0, tour.length - 1);
      const local = clamp(scaled - idx, 0, 1);

      void local;
      setActive((prev) => (prev === idx ? prev : idx));
      // No frame zoom: each clip carries its own camera move, and scroll-driven
      // scaling of the video reads poorly. Rooms simply crossfade.
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
  }, [reduced]);

  // ---- Reduced-motion / no-JS-camera fallback: a stacked sequence ----
  if (reduced) {
    return (
      <section id="tour" ref={sectionRef} className="bg-ink-900">
        {tour.map((stop) => (
          <div key={stop.id} className="relative min-h-[90svh] w-full overflow-hidden">
            <Backdrop tone={stop.tone} variant={variantFor(stop.room)} media={stop.media} video={isVideo(stop.media)} alt={stop.room} dim={0.45} grain={false} />
            <RoomCopy stop={stop} animate={false} />
          </div>
        ))}
      </section>
    );
  }

  const current = tour[active];

  return (
    <section
      id="tour"
      ref={sectionRef}
      className="relative bg-ink-900"
      style={{ height: `${tour.length * 100}vh` }}
      aria-label="Cinematic house tour"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* stacked crossfading room plates */}
        {tour.map((stop, i) => (
          <div
            key={stop.id}
            className="absolute inset-0 transition-opacity duration-700 ease-smooth"
            style={{ opacity: i === active ? 1 : 0 }}
            aria-hidden={i !== active}
          >
            <Backdrop tone={stop.tone} variant={variantFor(stop.room)} media={stop.media} video={isVideo(stop.media)} playing={i === active} alt={stop.room} dim={0.42} />
          </div>
        ))}

        {/* camera HUD + room copy */}
        <div className="relative z-10 flex h-full flex-col justify-between py-24 sm:py-28">
          <div className="container-x flex items-center justify-between">
            <span className="eyebrow text-shadow-cine">Interior tour</span>
            <span className="font-display text-sm text-bone-muted">
              <span className="text-brass">{current.index}</span> / {String(tour.length).padStart(2, "0")}
            </span>
          </div>

          <div className="container-x">
            <RoomCopy key={active} stop={current} animate />
            {/* chapter ticks = camera position */}
            <div className="mt-10 flex gap-2">
              {tour.map((s, i) => (
                <span
                  key={s.id}
                  className="h-0.5 flex-1 rounded-full bg-bone/20"
                  aria-hidden="true"
                >
                  <span
                    className="block h-full rounded-full bg-brass transition-all duration-500"
                    style={{ width: i <= active ? "100%" : "0%" }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoomCopy({ stop, animate }: { stop: (typeof tour)[number]; animate: boolean }) {
  return (
    <div className={animate ? "tour-copy-enter" : undefined}>
      <div className="max-w-2xl">
        <p className="mb-3 font-display text-lg text-brass">{stop.room}</p>
        <h3 className="text-display-md text-shadow-cine">{stop.headline}</h3>
        <p className="mt-5 max-w-reading text-base leading-relaxed text-bone-soft sm:text-lg">
          {stop.copy}
        </p>
        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
          {stop.specs.map((sp) => (
            <div key={sp.label} className="plate px-4 py-3">
              <dt className="text-[10px] uppercase tracking-widest text-bone-faint">{sp.label}</dt>
              <dd className="mt-1 font-display text-lg text-bone">{sp.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
