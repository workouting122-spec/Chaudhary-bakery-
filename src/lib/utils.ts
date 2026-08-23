export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export const isMobile = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 767px)").matches;

/** True when a media path points at a video file (so scenes render <video>). */
export const isVideo = (src?: string) =>
  !!src && /\.(mp4|webm|mov|m4v|ogv|ogg)$/i.test(src);
