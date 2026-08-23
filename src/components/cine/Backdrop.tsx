import { forwardRef, useEffect, useRef, useState } from "react";
import type { SceneTone } from "@/types";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TONES } from "./tones";
import SceneArt, { type ArtVariant } from "./SceneArt";

interface Props {
  tone: SceneTone;
  variant?: ArtVariant;
  /** Optional real asset. Image by default; pass `video` to render <video>. */
  media?: string;
  video?: boolean;
  poster?: string;
  alt?: string;
  /** 0–1 darkening so overlaid text always meets contrast. */
  dim?: number;
  grain?: boolean;
  /** Gate video playback (e.g. only the active tour room). Default true. */
  playing?: boolean;
  /** Oversize the plate so a scene can parallax-translate it without exposing
   *  an edge. Off by default — the frame then sits still and un-zoomed. */
  parallax?: boolean;
  className?: string;
}

/**
 * The environment layer behind every scene: generated architectural art (or a
 * real photo/video when supplied), graded by `tone`, finished with a cinematic
 * vignette + optional film grain. Absolutely fills its positioned parent.
 * The inner `[data-parallax]` node is what scenes translate for camera moves.
 *
 * Video playback is gated so we never decode many clips at once: a clip plays
 * only when it is on-screen AND `playing` (the active layer) AND motion is
 * allowed — otherwise it pauses and holds its first frame.
 */
const Backdrop = forwardRef<HTMLDivElement, Props>(function Backdrop(
  { tone, variant = "interior", media, video, poster, alt = "", dim = 0.35, grain = true, playing = true, parallax = false, className },
  ref
) {
  const p = TONES[tone];
  const vidRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();
  const isVid = !!media && !!video;

  // Only observe/decode when this is actually a video backdrop.
  useEffect(() => {
    if (!isVid) return;
    const el = vidRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, [isVid]);

  useEffect(() => {
    if (!isVid) return;
    const el = vidRef.current;
    if (!el) return;
    if (playing && inView && !reduced) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [isVid, playing, inView, reduced]);

  return (
    <div ref={ref} className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden={!media}>
      {/* plate — oversized only when a scene will parallax-translate it, so a
          still frame is shown un-zoomed (object-cover crops to fill either way) */}
      <div data-parallax className={cn("absolute", parallax ? "inset-[-8%]" : "inset-0")}>
        {media ? (
          isVid ? (
            <video
              ref={vidRef}
              className="h-full w-full object-cover"
              muted
              loop
              playsInline
              preload="metadata"
              poster={poster}
              aria-label={alt || undefined}
            >
              <source src={media} />
            </video>
          ) : (
            <img src={media} alt={alt} className="h-full w-full object-cover" loading="lazy" decoding="async" />
          )
        ) : (
          <SceneArt variant={variant} p={p} className="h-full w-full" />
        )}
      </div>

      {/* cinematic vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 42%, transparent 40%, rgba(6,7,10,0.55) 100%)",
        }}
      />
      {/* base dim for text contrast */}
      <div className="pointer-events-none absolute inset-0" style={{ background: `rgba(8,9,12,${dim})` }} />

      {grain && (
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay motion-safe:animate-grain-shift" />
      )}
    </div>
  );
});

export default Backdrop;
