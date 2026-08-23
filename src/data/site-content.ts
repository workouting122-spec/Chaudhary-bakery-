import type { Landmark, Testimonial, Stat, TourStop } from "@/types";

/** SCENE — Amenities. Kept as a curated shortlist, not a feature dump.
 *  `media` is optional — add a photo/video path to replace the generated art. */
export const amenities: { title: string; copy: string; tone: TourStop["tone"]; media?: string }[] = [
  { title: "Infinity Pool", copy: "An 18-metre mirror edge that folds the horizon back into the house.", tone: "dusk" },
  { title: "Private Spa", copy: "Steam, sauna and a stone plunge pool set below grade in cool quiet.", tone: "cool-interior" },
  { title: "Cellar & Tasting", copy: "A temperature-held cellar for 1,500 bottles with a private tasting table.", tone: "night" },
  { title: "Garden & Orchard", copy: "Mature landscaping, a walled kitchen garden and a standing orchard.", tone: "garden" },
];

/** SCENE — Location. Optional aerial/establishing clip behind the connectivity
 *  list; leave "" to use the generated landscape. */
export const locationMedia = "/assets/location/aerial.mp4";

/** SCENE — Location. Distances are illustrative placeholders. */
export const landmarks: Landmark[] = [
  { name: "International Airport", distance: "35 min", kind: "Connectivity" },
  { name: "City Financial District", distance: "22 min", kind: "Work" },
  { name: "Coastline & Marina", distance: "15 min", kind: "Leisure" },
  { name: "International School", distance: "10 min", kind: "Family" },
  { name: "Fine-dining Quarter", distance: "12 min", kind: "Dining" },
  { name: "Nature Reserve", distance: "8 min", kind: "Outdoors" },
];

/** SCENE — Trust. Neutral, non-fabricated placeholders — replace with real,
 *  verifiable figures. Do NOT publish invented statistics. */
export const stats: Stat[] = [
  { value: "—", label: "Years designing residences", note: "Replace with real figure" },
  { value: "—", label: "Homes completed", note: "Replace with real figure" },
  { value: "—", label: "Design awards", note: "Replace with real figure" },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "The walk-through sold the house before we ever set foot inside. It felt like moving through a film of our future life.",
    author: "Client placeholder",
    role: "Owner — replace with real attribution",
  },
  {
    quote:
      "Every detail was considered. The light, the materials, the silence. Nothing about it felt like a transaction.",
    author: "Client placeholder",
    role: "Owner — replace with real attribution",
  },
];
