import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const LINES = [
  "We do not build houses.",
  "We compose the light",
  "that moves through them —",
  "hour by hour, room by room.",
];

/**
 * SCENE — The Brand. An editorial statement whose words wipe in on scroll and
 * a giant ghost numeral drifts behind them (text displacement + parallax),
 * deliberately not a fade-in block.
 */
export default function Brand() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      // word-by-word brightening as the statement scrolls through center
      gsap.to("[data-word]", {
        color: "#F3EFE7",
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top 70%",
          end: "center 45%",
          scrub: true,
        },
      });
      // parallax ghost numeral
      gsap.to("[data-ghost]", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
      return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section
      ref={root}
      className="relative overflow-hidden border-y border-bone/5 bg-ink-950 py-[22vh]"
    >
      <span
        data-ghost
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none font-display text-[38vw] leading-none text-bone/[0.03] sm:text-[26vw]"
      >
        M
      </span>

      <div className="container-x relative">
        <p className="eyebrow mb-10">The philosophy</p>
        <h2 className="max-w-4xl font-display text-[clamp(1.8rem,4.6vw,3.4rem)] leading-[1.15]">
          {LINES.map((line, li) => (
            <span key={li} className="block">
              {line.split(" ").map((w, wi) => (
                <span key={wi} data-word className="text-bone/25">
                  {w}{" "}
                </span>
              ))}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
