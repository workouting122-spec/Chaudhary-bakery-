import { useId } from "react";
import type { TonePalette } from "./tones";

export type ArtVariant = "exterior" | "interior" | "aperture" | "landscape";

interface Props {
  variant: ArtVariant;
  p: TonePalette;
  className?: string;
}

/**
 * Generated architectural artwork — a self-contained SVG "render" of the house
 * for each scene. This is intentional placeholder environment art so the site
 * has zero missing-asset 404s; drop a real photo/video into a scene's `media`
 * to replace it. preserveAspectRatio="xMidYMid slice" behaves like object-cover.
 */
export default function SceneArt({ variant, p, className }: Props) {
  const uid = useId().replace(/[:]/g, "");
  const sky = `sky-${uid}`;
  const glow = `glow-${uid}`;
  const floor = `floor-${uid}`;
  const glass = `glass-${uid}`;

  return (
    <svg
      className={className}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      role="presentation"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.skyTop} />
          <stop offset="1" stopColor={p.skyBottom} />
        </linearGradient>
        <radialGradient id={glow} cx="50%" cy="42%" r="60%">
          <stop offset="0" stopColor={p.light} stopOpacity="0.55" />
          <stop offset="0.5" stopColor={p.light} stopOpacity="0.12" />
          <stop offset="1" stopColor={p.light} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={floor} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.ground} stopOpacity="0.2" />
          <stop offset="1" stopColor={p.ground} stopOpacity="1" />
        </linearGradient>
        <linearGradient id={glass} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.glass} stopOpacity="0.85" />
          <stop offset="1" stopColor={p.haze} stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* sky / ambient base shared by every variant */}
      <rect width="1600" height="900" fill={`url(#${sky})`} />
      <rect width="1600" height="900" fill={`url(#${glow})`} />

      {variant === "landscape" && <Landscape p={p} glassId={glass} />}
      {variant === "exterior" && <Exterior p={p} glassId={glass} floorId={floor} />}
      {variant === "interior" && <Interior p={p} glassId={glass} floorId={floor} />}
      {variant === "aperture" && <Aperture p={p} glassId={glass} floorId={floor} />}

      {/* cinematic vignette on top of everything */}
      <rect width="1600" height="900" fill="url(#vignette-shared)" opacity="0" />
    </svg>
  );
}

function Landscape({ p, glassId }: { p: TonePalette; glassId: string }) {
  return (
    <g>
      {/* layered ridgelines receding into haze */}
      <path d="M0 560 L280 470 L520 540 L820 440 L1120 540 L1360 470 L1600 540 L1600 900 L0 900 Z" fill={p.haze} opacity="0.5" />
      <path d="M0 640 L360 560 L680 640 L980 540 L1280 640 L1600 580 L1600 900 L0 900 Z" fill={p.ground} opacity="0.7" />
      <path d="M0 740 L420 690 L900 760 L1600 700 L1600 900 L0 900 Z" fill={p.ground} />
      <rect y="720" width="1600" height="180" fill={`url(#${glassId})`} opacity="0.25" />
    </g>
  );
}

function Exterior({ p, glassId, floorId }: { p: TonePalette; glassId: string; floorId: string }) {
  return (
    <g>
      {/* distant ridge */}
      <path d="M0 520 L400 470 L900 520 L1600 480 L1600 620 L0 620 Z" fill={p.haze} opacity="0.4" />
      {/* the house — stacked cantilevered volumes */}
      <g>
        {/* lower volume */}
        <rect x="360" y="470" width="900" height="230" fill={p.ground} />
        {/* cantilevered upper volume */}
        <rect x="300" y="360" width="640" height="150" fill={p.skyTop} opacity="0.92" />
        {/* glazing bands (warm interior light) */}
        <rect x="400" y="500" width="300" height="150" fill={`url(#${glassId})`} />
        <rect x="740" y="500" width="460" height="150" fill={p.light} opacity="0.22" />
        <rect x="340" y="392" width="560" height="92" fill={p.light} opacity="0.16" />
        {/* mullions */}
        {Array.from({ length: 7 }).map((_, i) => (
          <rect key={i} x={400 + i * 115} y="500" width="2" height="150" fill={p.ground} opacity="0.5" />
        ))}
        {/* slender columns */}
        <rect x="380" y="470" width="6" height="230" fill={p.ground} />
        <rect x="1234" y="470" width="6" height="230" fill={p.ground} />
      </g>
      {/* reflecting pool + ground */}
      <rect y="700" width="1600" height="200" fill={`url(#${floorId})`} />
      <rect x="180" y="720" width="1240" height="70" fill={p.glass} opacity="0.14" />
    </g>
  );
}

function Interior({ p, glassId, floorId }: { p: TonePalette; glassId: string; floorId: string }) {
  return (
    <g>
      {/* one-point-perspective room: ceiling, side walls, back glazing to a view */}
      {/* ceiling */}
      <path d="M0 0 L1600 0 L1180 250 L420 250 Z" fill={p.ground} opacity="0.55" />
      {/* left wall */}
      <path d="M0 0 L420 250 L420 700 L0 900 Z" fill={p.ground} opacity="0.8" />
      {/* right wall */}
      <path d="M1600 0 L1180 250 L1180 700 L1600 900 Z" fill={p.ground} opacity="0.72" />
      {/* back wall = full-height glazing onto landscape */}
      <rect x="420" y="250" width="760" height="450" fill={`url(#${glassId})`} />
      {/* a horizon seen through the glass */}
      <path d="M420 520 L720 470 L1180 520 L1180 560 L420 560 Z" fill={p.haze} opacity="0.6" />
      {/* glazing mullions */}
      {Array.from({ length: 5 }).map((_, i) => (
        <rect key={i} x={420 + i * 190} y="250" width="3" height="450" fill={p.ground} opacity="0.45" />
      ))}
      {/* floor with soft reflection of the light */}
      <path d="M420 700 L1180 700 L1600 900 L0 900 Z" fill={`url(#${floorId})`} />
      <rect x="560" y="720" width="480" height="10" fill={p.light} opacity="0.10" />
      {/* low furniture silhouette anchoring the room */}
      <rect x="620" y="600" width="360" height="70" rx="10" fill={p.ground} />
      <rect x="700" y="560" width="200" height="14" rx="7" fill={p.light} opacity="0.14" />
    </g>
  );
}

function Aperture({ p, glassId, floorId }: { p: TonePalette; glassId: string; floorId: string }) {
  return (
    <g>
      {/* dark interior wall with a single tall illuminated doorway */}
      <rect width="1600" height="900" fill={p.ground} opacity="0.9" />
      {/* light spill on the floor */}
      <path d="M640 900 L960 900 L1120 560 L520 560 Z" fill={p.light} opacity="0.10" />
      {/* the pivot door aperture */}
      <rect x="640" y="150" width="320" height="620" fill={`url(#${glassId})`} />
      <rect x="640" y="150" width="320" height="620" fill={p.light} opacity="0.10" />
      {/* view of horizon through the aperture */}
      <path d="M640 520 L800 495 L960 520 L960 560 L640 560 Z" fill={p.haze} opacity="0.7" />
      {/* the door leaf, part-open */}
      <rect x="944" y="150" width="18" height="620" fill={p.light} opacity="0.25" />
      <rect y="720" width="1600" height="180" fill={`url(#${floorId})`} />
    </g>
  );
}
