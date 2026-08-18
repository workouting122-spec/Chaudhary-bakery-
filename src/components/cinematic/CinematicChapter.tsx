import { useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Where the editorial text/UI lives inside a chapter. The opposite side is the
 * "hero object zone" — the cake/chocolate — which always keeps visual priority.
 * (See blueprint §05 Safe-Zone Graphics.)
 */
export type SafeZone =
  | "upper-left"
  | "left"
  | "lower-left"
  | "upper-right"
  | "right"
  | "lower-right"
  | "center";

export interface ChapterConfig {
  index: number;
  total: number;
  eyebrow: string;
  headline: ReactNode;
  body?: ReactNode;
  /** Small, late-appearing line (e.g. "SCROLL TO DISCOVER"). */
  small?: string;
  cta?: { label: string; to: string };
  video: { src: string; mobileSrc?: string; poster?: string };
  zone: SafeZone;
  /** progress (0-1) at which the large typography should be gone — for reveals
   *  where the cake must dominate the final stretch (blueprint clip 06). */
  contentOutAt?: number;
  /** height of the scroll space in viewport multiples (controls scrub length). */
  scroll?: number;
  /** object-position for the full-bleed video, to keep the hero object framed. */
  objectPosition?: string;
}

const LEFT_ZONES: SafeZone[] = ["upper-left", "left", "lower-left"];

// Content block placement within the sticky viewport.
const zoneClass: Record<SafeZone, string> = {
  "upper-left": "top-[calc(var(--nav-h)+5vh)] left-5 sm:left-10 items-start text-left",
  left: "top-1/2 -translate-y-1/2 left-5 sm:left-10 items-start text-left",
  "lower-left": "bottom-[15vh] left-5 sm:left-10 items-start text-left",
  "upper-right": "top-[calc(var(--nav-h)+5vh)] right-5 sm:right-10 items-end text-right",
  right: "top-1/2 -translate-y-1/2 right-5 sm:right-10 items-end text-right",
  "lower-right": "bottom-[15vh] right-5 sm:right-10 items-end text-right",
  center:
    "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center text-center",
};

// Readability gradient — darkens the side the text sits on so copy stays legible
// over bright chocolate without ever hiding the hero object.
const readabilityClass = (zone: SafeZone): string => {
  if (zone === "center")
    return "bg-[radial-gradient(120%_90%_at_50%_60%,rgba(12,7,4,0.72)_0%,rgba(12,7,4,0.35)_45%,rgba(12,7,4,0)_75%)]";
  if (LEFT_ZONES.includes(zone))
    return "bg-[linear-gradient(90deg,rgba(12,7,4,0.86)_0%,rgba(12,7,4,0.52)_30%,rgba(12,7,4,0)_62%)]";
  return "bg-[linear-gradient(270deg,rgba(12,7,4,0.86)_0%,rgba(12,7,4,0.52)_30%,rgba(12,7,4,0)_62%)]";
};

const pad2 = (n: number) => String(n).padStart(2, "0");

export default function CinematicChapter({
  index,
  total,
  eyebrow,
  headline,
  body,
  small,
  cta,
  video,
  zone,
  contentOutAt = 0.86,
  scroll = 2.2,
  objectPosition = "center",
}: ChapterConfig) {
  const space = useRef<HTMLDivElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const vid = videoRef.current;
      const scope = sticky.current;
      if (!vid || !scope || !space.current) return;

      vid.pause();

      // Scroll drives the frame — never autoplay/loop (blueprint §04).
      const seek = (p: number) => {
        if (isFinite(vid.duration) && vid.duration > 0) {
          vid.currentTime = Math.min(vid.duration * p, vid.duration - 0.05);
        }
      };

      const q = gsap.utils.selector(scope);
      const eyebrowEl = q(".ci-eyebrow");
      const headlineEl = q(".ci-headline");
      const bodyEl = q(".ci-body");
      const smallEl = q(".ci-small");
      const ctaEl = q(".ci-cta");
      const primary = [...eyebrowEl, ...headlineEl, ...bodyEl, ...ctaEl];

      gsap.set(primary, { autoAlpha: 0, y: 30 });
      if (smallEl.length) gsap.set(smallEl, { autoAlpha: 0, y: 14 });

      // Scrubbed choreography timeline — position params are normalised 0→1 so
      // timeline.progress() maps 1:1 onto scroll progress.
      const tl = gsap.timeline({ paused: true });
      tl.to(eyebrowEl, { autoAlpha: 1, y: 0, duration: 0.13, ease: "power2.out" }, 0.02)
        .to(headlineEl, { autoAlpha: 1, y: 0, duration: 0.17, ease: "power3.out" }, 0.1)
        .to(bodyEl, { autoAlpha: 1, y: 0, duration: 0.16, ease: "power2.out" }, 0.22);
      if (ctaEl.length)
        tl.to(ctaEl, { autoAlpha: 1, y: 0, duration: 0.16, ease: "power2.out" }, 0.34);
      if (smallEl.length)
        tl.to(smallEl, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.7).to(
          smallEl,
          { autoAlpha: 0, y: -10, duration: 0.1 },
          Math.max(0.78, contentOutAt - 0.06)
        );
      // Exit — text clears before the chapter ends so the frame breathes.
      tl.to(primary, { autoAlpha: 0, y: -26, duration: 0.12, ease: "power2.in" }, contentOutAt);
      tl.set({}, {}, 1); // pin timeline length to exactly 1

      const st = ScrollTrigger.create({
        trigger: space.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          seek(self.progress);
          tl.progress(self.progress);
          if (barRef.current) gsap.set(barRef.current, { scaleX: self.progress });
        },
      });

      // Buffer the clip ~one screen before it's reached, so scrubbing is smooth.
      const loader = ScrollTrigger.create({
        trigger: space.current,
        start: "top bottom",
        once: true,
        onEnter: () => {
          vid.preload = "auto";
          vid.load();
        },
      });

      const onMeta = () => ScrollTrigger.refresh();
      vid.addEventListener("loadedmetadata", onMeta);

      return () => {
        vid.removeEventListener("loadedmetadata", onMeta);
        st.kill();
        loader.kill();
        tl.kill();
      };
    },
    { scope: sticky, dependencies: [reduced] }
  );

  // ---- Reduced-motion fallback: a single readable full-height frame ----------
  if (reduced) {
    return (
      <section className="relative flex min-h-screen items-center overflow-hidden bg-choc-950">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-70"
          style={{ objectPosition }}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={video.poster}
          aria-hidden="true"
        >
          <source src={video.src} type="video/mp4" />
        </video>
        <div className={cn("pointer-events-none absolute inset-0", readabilityClass(zone))} />
        <div className={cn("absolute z-10 flex max-w-[min(90vw,34rem)] flex-col gap-4", zoneClass[zone])}>
          <p className="eyebrow !text-gold-soft">{eyebrow}</p>
          <h2 className="font-display text-display-md font-normal text-cream-50">{headline}</h2>
          {body && <p className="max-w-md text-base leading-relaxed text-cream-200/85">{body}</p>}
          {cta && (
            <Link to={cta.to} className="btn-primary pointer-events-auto mt-2 w-fit">
              {cta.label}
            </Link>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="cinematic-chapter relative bg-choc-950" aria-label={eyebrow}>
      <div ref={space} className="chapter-scroll-space" style={{ height: `${scroll * 100}vh` }}>
        <div
          ref={sticky}
          className="cinematic-sticky sticky top-0 flex h-[100dvh] items-center overflow-hidden bg-choc-950"
        >
          {/* Z-1 — VIDEO (full-bleed cinematic environment) */}
          <video
            ref={videoRef}
            className="absolute inset-0 z-[1] h-full w-full object-cover"
            style={{ objectPosition }}
            muted
            playsInline
            preload="none"
            poster={video.poster}
            aria-label={typeof headline === "string" ? headline : eyebrow}
          >
            {video.mobileSrc && (
              <source src={video.mobileSrc} type="video/mp4" media="(max-width: 767px)" />
            )}
            <source src={video.src} type="video/mp4" />
          </video>

          {/* Z-2 — CINEMATIC OVERLAY: vignette + readability gradient */}
          <div
            className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(130%_120%_at_50%_42%,transparent_46%,rgba(8,4,2,0.6)_100%)]"
            aria-hidden="true"
          />
          <div
            className={cn("pointer-events-none absolute inset-0 z-[2]", readabilityClass(zone))}
            aria-hidden="true"
          />
          {/* top scrim so the nav stays legible over bright frames */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-32 bg-gradient-to-b from-choc-950/70 to-transparent"
            aria-hidden="true"
          />

          {/* Z-3 — CINEMATIC INFORMATION: chapter counter + progress line.
              Counter sits top-right (below the nav) to clear the WhatsApp FAB. */}
          <div className="pointer-events-none absolute right-5 top-[calc(var(--nav-h)+3vh)] z-[3] flex items-baseline gap-1 sm:right-10">
            <span className="font-display text-xl text-cream-50">{pad2(index)}</span>
            <span className="font-sans text-xs tracking-widest2 text-cream-50/40">/ {pad2(total)}</span>
          </div>
          <div className="pointer-events-none absolute bottom-8 left-1/2 z-[3] h-px w-40 -translate-x-1/2 overflow-hidden bg-cream-50/15">
            <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-gold" />
          </div>

          {/* Z-4/5 — EDITORIAL TYPOGRAPHY + CTA */}
          <div className={cn("absolute z-[4] flex max-w-[min(90vw,34rem)] flex-col gap-4", zoneClass[zone])}>
            <p className="ci-eyebrow eyebrow !text-gold-soft">{eyebrow}</p>
            <h2 className="ci-headline font-display text-display-md font-normal leading-[1.04] text-cream-50 [text-shadow:0_2px_30px_rgba(0,0,0,0.35)]">
              {headline}
            </h2>
            {body && (
              <p className="ci-body max-w-md text-base leading-relaxed text-cream-200/85 sm:text-lg">
                {body}
              </p>
            )}
            {cta && (
              <Link to={cta.to} className="ci-cta btn-primary pointer-events-auto z-[5] mt-2 w-fit">
                {cta.label}
              </Link>
            )}
            {small && (
              <p className="ci-small eyebrow mt-3 !text-[10px] !text-cream-50/60">{small}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
