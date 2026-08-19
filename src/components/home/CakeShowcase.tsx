import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { RotateCw } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { formatINR } from "@/lib/utils";

/**
 * Premium product presentation of the finished cake. Rather than a low-fidelity
 * procedural 3D model, this frames the real 360° footage as a luxury showcase:
 * a single hero piece, softly shadowed, with breathing room around it.
 * (PRD §23–§24 — no fake 3D; present the real cake beautifully.)
 */
export default function CakeShowcase() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(".cs-reveal", {
        y: 26,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 72%" },
      });
      gsap.fromTo(
        ".cs-stage",
        { scale: 0.965, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 68%" },
        }
      );
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-gradient-to-b from-cream-100 to-cream-200 py-20 md:py-28"
      aria-label="The finished piece"
    >
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Stage — the cake, framed with breathing room and a soft shadow */}
        <div className="cs-stage relative mx-auto w-full max-w-2xl">
          {/* soft ground shadow */}
          <div
            className="pointer-events-none absolute inset-x-8 bottom-4 h-10 rounded-[50%] bg-ink/25 blur-2xl"
            aria-hidden="true"
          />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/60 bg-cream-50 shadow-lift">
            <div className="aspect-[4/3] w-full bg-choc-950">
              <video
                className="h-full w-full object-cover"
                autoPlay={!reduced}
                loop
                muted
                playsInline
                preload="metadata"
                poster="/assets/frame-04-final-decorated.png"
                aria-label="The finished chocolate cake, turning slowly to show every angle"
              >
                <source src="/assets/hero-360-cake.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="pointer-events-none absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-ink/45 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest2 text-cream-50 backdrop-blur">
              <RotateCw size={12} /> 360° view
            </div>
          </div>
        </div>

        {/* Copy — title, description, price, CTA */}
        <div className="text-center lg:text-left">
          <p className="cs-reveal eyebrow mb-3">The finished piece</p>
          <h2 className="cs-reveal font-display text-display-md font-normal">
            Turn it, tilt it, admire it — this is what arrives.
          </h2>
          <p className="cs-reveal mt-5 max-w-md text-base leading-relaxed text-ink-soft lg:mx-0">
            Our signature dark-chocolate showpiece — three sponge layers, smooth
            ganache, tempered shards and a touch of gold. Handcrafted, eggless,
            and finished by hand for the moment it matters.
          </p>
          <p className="cs-reveal mt-6 font-display text-2xl text-ink">
            {formatINR(749)}
            <span className="ml-1 align-middle text-sm font-sans text-ink-faint">/ kg</span>
          </p>
          <div className="cs-reveal mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link to="/shop" className="btn-primary">
              Order a cake like this
            </Link>
            <Link to="/gallery" className="btn-ghost">
              See the gallery
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
