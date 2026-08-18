import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * The single seam between the brand film and the storefront. It carries the
 * dark chocolate world up into the cream page so the two experiences read as
 * one continuous journey — never an abrupt template switch. (Blueprint §01.)
 */
export default function CollectionTransition() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(".ct-reveal", {
        y: 30,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section
      ref={root}
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-b from-choc-950 via-choc-900 to-cream-100 py-28 text-center"
      aria-label="The Chocolate Collection"
    >
      <div className="container-x">
        <p className="ct-reveal eyebrow mb-5 !text-gold-soft">Now, make it yours</p>
        <h2 className="ct-reveal font-display text-[clamp(2.25rem,6vw,4.5rem)] font-normal leading-[1.02] text-cream-50">
          The Chocolate
          <span className="block italic text-gold">Collection</span>
        </h2>
        <p className="ct-reveal mx-auto mt-6 max-w-xl text-base text-cream-200/80 sm:text-lg">
          Every cake in the film is a cake you can order — handcrafted, eggless,
          and delivered fresh across {" "}
          <span className="text-cream-50">your neighbourhood</span>.
        </p>
        <div className="ct-reveal mx-auto mt-9 h-px w-24 bg-gold/50" />
      </div>
    </section>
  );
}
