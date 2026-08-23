import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface Chapter {
  id: string;
  label: string;
}

/**
 * The "camera timeline" — a fixed rail expressing scroll-as-camera-position.
 * Desktop: a right-edge vertical rail with chapter ticks that also navigate.
 * Mobile: a thin top progress bar. Purely presentational + jump navigation.
 */
export default function CameraTimeline({ chapters }: { chapters: Chapter[] }) {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        setProgress(max > 0 ? doc.scrollTop / max : 0);

        // active chapter = the last section whose top has passed 45% viewport
        const mark = window.innerHeight * 0.45;
        let idx = 0;
        chapters.forEach((c, i) => {
          const el = document.getElementById(c.id);
          if (el && el.getBoundingClientRect().top <= mark) idx = i;
        });
        setActive(idx);
        ticking.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [chapters]);

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      {/* mobile top progress */}
      <div className="fixed inset-x-0 top-0 z-40 h-0.5 bg-transparent lg:hidden" aria-hidden="true">
        <div
          className="h-full bg-brass transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* desktop vertical rail */}
      <nav
        aria-label="Tour chapters"
        className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex"
      >
        <div className="relative h-52 w-px bg-bone/15">
          <div
            className="absolute left-0 top-0 w-px bg-brass"
            style={{ height: `${progress * 100}%` }}
          />
        </div>
        <ul className="flex flex-col gap-3">
          {chapters.map((c, i) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => go(c.id)}
                className="group flex items-center gap-2"
                aria-current={i === active ? "true" : undefined}
              >
                <span className="w-24 text-right text-[10px] font-medium uppercase tracking-widest text-bone-muted opacity-0 transition group-hover:opacity-100">
                  {c.label}
                </span>
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all duration-300",
                    i === active ? "scale-150 bg-brass" : "bg-bone/30 group-hover:bg-bone/60"
                  )}
                />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
