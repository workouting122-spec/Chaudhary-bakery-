import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const phrases = [
  "Every cake, handcrafted.",
  "Every layer, made with love.",
  "Every bite, unforgettable.",
];

export default function TaglinePin() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const items = gsap.utils.toArray<HTMLElement>(".tag-phrase");
      gsap.set(items, { autoAlpha: 0, y: 20 });
      gsap.set(items[0], { autoAlpha: 1, y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 1,
        },
      });

      items.forEach((el, i) => {
        if (i === 0) return;
        tl.to(items[i - 1], { autoAlpha: 0, y: -20, duration: 0.4 }).to(
          el,
          { autoAlpha: 1, y: 0, duration: 0.4 },
          "<"
        );
      });
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <div
      ref={root}
      className="relative flex min-h-screen items-center bg-cream-100"
    >
      <div className="container-x grid items-center gap-10 md:grid-cols-2">
        <div className="order-2 flex justify-center md:order-1">
          <video
            className="h-[40vh] w-auto object-contain drop-shadow-[0_30px_40px_rgba(43,38,34,0.22)]"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/assets/frame-04-final-decorated.png"
            aria-hidden="true"
          >
            <source src="/assets/hero-360-cake.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="relative order-1 h-[6em] md:order-2 md:h-[4em]">
          {reduced
            ? phrases.map((p) => (
                <p key={p} className="font-display text-display-md">
                  {p}
                </p>
              ))
            : phrases.map((p) => (
                <p
                  key={p}
                  className="tag-phrase absolute inset-0 font-display text-display-md"
                >
                  {p}
                </p>
              ))}
        </div>
      </div>
    </div>
  );
}
