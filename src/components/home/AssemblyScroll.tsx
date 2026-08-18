import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn, isMobile } from "@/lib/utils";

const captions = [
  { at: 0, text: "It starts with an empty stand." },
  { at: 0.33, text: "Layers of soft sponge, kissed with vanilla cream." },
  { at: 0.66, text: "Fresh berries — because it should taste like the season." },
  { at: 1, text: "Finished by hand. Ready for you." },
];

const frames = [
  { src: "/assets/frame-01-empty-stand.png", text: captions[0].text },
  { src: "/assets/frame-02-naked-2layer.png", text: captions[1].text },
  { src: "/assets/frame-03-naked-3layer-berries.png", text: captions[2].text },
  { src: "/assets/frame-04-final-decorated.png", text: captions[3].text },
];

export default function AssemblyScroll() {
  const root = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const video = videoRef.current;
      if (!video) return;

      // Never autoplay here — scroll drives the frame.
      video.pause();
      video.load();

      const distance = isMobile() ? "150%" : "200%";

      const seek = (progress: number) => {
        if (isFinite(video.duration) && video.duration > 0) {
          // clamp a hair under duration to avoid the black last-frame flash
          video.currentTime = Math.min(video.duration * progress, video.duration - 0.05);
        }
      };

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: `+=${distance}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          seek(self.progress);
          const p = self.progress;
          const idx = p < 0.28 ? 0 : p < 0.6 ? 1 : p < 0.9 ? 2 : 3;
          setActive((prev) => (prev === idx ? prev : idx));
        },
      });

      // Once metadata is ready, refresh so the pin distance is measured correctly.
      const onMeta = () => ScrollTrigger.refresh();
      video.addEventListener("loadedmetadata", onMeta);

      return () => {
        video.removeEventListener("loadedmetadata", onMeta);
        st.kill();
      };
    },
    { scope: root, dependencies: [reduced] }
  );

  // ---- Reduced-motion / no-JS-scrub fallback: stacked stills with captions ----
  if (reduced) {
    return (
      <section aria-label="How each cake is made" className="bg-cream-100 py-20">
        <div className="container-x space-y-16">
          {frames.map((f) => (
            <figure key={f.src} className="mx-auto max-w-3xl text-center">
              <img src={f.src} alt={f.text} className="mx-auto rounded-2xl shadow-card" loading="lazy" />
              <figcaption className="mt-5 font-display text-2xl text-ink">{f.text}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={root}
      aria-label="How each cake is made, revealed as you scroll"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream-100"
    >
      <video
        ref={videoRef}
        className="h-[60vh] w-auto max-w-[94vw] object-contain md:h-[80vh]"
        muted
        playsInline
        preload="metadata"
        poster="/assets/frame-01-empty-stand.png"
        aria-label="A cake being assembled from an empty stand to a finished decorated cake"
      >
        <source src="/assets/cake-assembly.mp4" type="video/mp4" />
      </video>

      {/* Captions (accessible text, not baked into the video) */}
      <div className="pointer-events-none absolute bottom-[12vh] left-5 right-5 sm:left-10 sm:right-auto sm:max-w-md">
        {captions.map((c, i) => (
          <p
            key={c.text}
            className={cn(
              "absolute font-display text-2xl text-ink transition-all duration-500 ease-smooth sm:text-3xl",
              active === i ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
          >
            {c.text}
          </p>
        ))}
      </div>

      {/* Progress hairline */}
      <div className="absolute bottom-8 left-1/2 h-px w-40 -translate-x-1/2 bg-gold/40" />
    </section>
  );
}
