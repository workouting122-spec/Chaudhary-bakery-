import type { SceneTone } from "@/types";

/** Each tone is a small palette that lights an entire scene the same way a
 *  cinematographer would grade a shot — so the whole tour reads as one film. */
export interface TonePalette {
  skyTop: string;
  skyBottom: string;
  ground: string;
  light: string; // key light / glow
  glass: string; // glazing tint
  haze: string; // atmospheric band
}

export const TONES: Record<SceneTone, TonePalette> = {
  dawn: {
    skyTop: "#1c2230",
    skyBottom: "#c99a76",
    ground: "#0d0f14",
    light: "#f3c8a0",
    glass: "#7d93ad",
    haze: "#e6b892",
  },
  day: {
    skyTop: "#5f7897",
    skyBottom: "#cdd6df",
    ground: "#0e1013",
    light: "#f6f2e9",
    glass: "#a9bccb",
    haze: "#d9e2ea",
  },
  dusk: {
    skyTop: "#141826",
    skyBottom: "#8a5a53",
    ground: "#0a0b0f",
    light: "#e39b6f",
    glass: "#6c6f86",
    haze: "#b06f5c",
  },
  night: {
    skyTop: "#080a10",
    skyBottom: "#161d2b",
    ground: "#06070a",
    light: "#c9a87c",
    glass: "#324156",
    haze: "#1a2233",
  },
  "warm-interior": {
    skyTop: "#1a1712",
    skyBottom: "#3a2c20",
    ground: "#120e0a",
    light: "#e8c79a",
    glass: "#caa877",
    haze: "#4a3826",
  },
  "cool-interior": {
    skyTop: "#12151a",
    skyBottom: "#232a33",
    ground: "#0b0d10",
    light: "#dfe6ec",
    glass: "#8fa4b6",
    haze: "#2b3540",
  },
  marble: {
    skyTop: "#181818",
    skyBottom: "#3d3a35",
    ground: "#100f0e",
    light: "#f0ebe1",
    glass: "#b9b2a6",
    haze: "#494440",
  },
  garden: {
    skyTop: "#16201a",
    skyBottom: "#3f5138",
    ground: "#0b0f0b",
    light: "#e7e0c4",
    glass: "#7f9a74",
    haze: "#2f4029",
  },
};
