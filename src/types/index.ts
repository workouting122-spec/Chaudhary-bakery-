/** A visual "tone" drives the self-contained gradient/SVG scene environment.
 *  These map to times of day / interior light so the tour reads as one film. */
export type SceneTone =
  | "dawn"
  | "day"
  | "dusk"
  | "night"
  | "warm-interior"
  | "cool-interior"
  | "marble"
  | "garden";

/** One room stop on the pinned house tour. `media` is optional — when empty the
 *  scene renders its generated environment, so there are no missing-asset 404s. */
export interface TourStop {
  id: string;
  index: string; // "01"
  room: string; // "Living Room"
  headline: string;
  copy: string;
  tone: SceneTone;
  specs: { label: string; value: string }[];
  media?: string; // e.g. "/assets/tour/living.jpg" — swap in real photography
}

export interface Residence {
  id: string;
  name: string;
  location: string;
  status: string; // "Available" | "Reserved" | ...
  price: string; // human string — no fabricated numbers
  beds: string;
  baths: string;
  area: string;
  tone: SceneTone;
  blurb: string;
  media?: string;
}

export interface Landmark {
  name: string;
  distance: string;
  kind: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export interface Stat {
  value: string;
  label: string;
  note?: string;
}
