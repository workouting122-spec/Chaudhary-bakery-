import { forwardRef } from "react";
import type { SceneTone } from "@/types";
import { cn } from "@/lib/utils";
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
  className?: string;
}

/**
 * The environment layer behind every scene: generated architectural art (or a
 * real photo/video when supplied), graded by `tone`, finished with a cinematic
 * vignette + optional film grain. Absolutely fills its positioned parent.
 * The inner `[data-parallax]` node is what scenes translate for camera moves.
 */
const Backdrop = forwardRef<HTMLDivElement, Props>(function Backdrop(
  { tone, variant = "interior", media, video, poster, alt = "", dim = 0.35, grain = true, className },
  ref
) {
  const p = TONES[tone];
  return (
    <div ref={ref} className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden={!media}>
      {/* parallax plate — slightly oversized so translate never exposes an edge */}
      <div data-parallax className="absolute inset-[-8%]">
        {media ? (
          video ? (
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={poster}
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
