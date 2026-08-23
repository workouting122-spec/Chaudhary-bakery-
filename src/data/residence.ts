import type { Residence, TourStop } from "@/types";

/**
 * THE MAIN CHARACTER — the featured residence the whole journey tours.
 *
 * ADDING VIDEO/PHOTO: set `media` to a file in /public (e.g. a 16:9 exterior
 * clip). It's used by the hero (Opening), the featured title card and the final
 * CTA. `.mp4/.webm/.mov` render as autoplaying muted loops; images render too.
 * Leave it unset to keep the generated architectural scene.
 */
export const featured: Residence = {
  id: "meridian-house",
  name: "The Meridian House",
  location: "Ridgeline, overlooking the valley", // PLACEHOLDER
  status: "Now Previewing",
  price: "Price on application",
  beds: "5 Bedrooms",
  baths: "6 Bathrooms",
  area: "8,400 sq ft",
  tone: "dusk",
  blurb:
    "A single, uninterrupted volume of light and stone. Meridian is designed to be walked, not scanned — each room opening onto the next like a held breath.",
  media: "/assets/hero/exterior-dusk.mp4",
};

/**
 * The pinned camera path. Order defines the scroll sequence.
 * Each stop takes an optional `media` (e.g. "/assets/tour/living.mp4") that
 * replaces the generated room art — see the animation prompt pack for one clip
 * per room. Videos autoplay muted + loop; keep them 16:9.
 */
export const tour: TourStop[] = [
  {
    id: "exterior",
    index: "01",
    room: "Exterior",
    headline: "The arrival",
    copy: "Stone and glass set low against the ridge. The house reveals itself slowly — a long approach, then the full elevation.",
    tone: "dusk",
    specs: [
      { label: "Elevation", value: "Board-formed concrete" },
      { label: "Approach", value: "120 m private drive" },
    ],
    // media: "/assets/tour/exterior.mp4",
  },
  {
    id: "entrance",
    index: "02",
    room: "Entrance",
    headline: "A threshold of light",
    copy: "A four-metre pivot door opens to a double-height hall. The ceiling lifts; the valley appears framed dead ahead.",
    tone: "warm-interior",
    specs: [
      { label: "Ceiling", value: "6.2 m double height" },
      { label: "Door", value: "4 m bronze pivot" },
    ],
    media: "/assets/tour/entrance.mp4",
  },
  {
    id: "living",
    index: "03",
    room: "Living Room",
    headline: "Where the walls disappear",
    copy: "Floor-to-ceiling glass slides fully into the wall. Inside and outside become a single continuous room.",
    tone: "day",
    specs: [
      { label: "Glazing", value: "Full-height, frameless" },
      { label: "Span", value: "14 m uninterrupted" },
    ],
    media: "/assets/tour/living.mp4",
  },
  {
    id: "dining",
    index: "04",
    room: "Dining",
    headline: "Gathered around light",
    copy: "A sculpted stone table anchors the room beneath a single linear skylight that tracks the sun across the day.",
    tone: "marble",
    specs: [
      { label: "Seating", value: "For twelve" },
      { label: "Light", value: "12 m linear skylight" },
    ],
    media: "/assets/tour/dining.mp4",
  },
  {
    id: "kitchen",
    index: "05",
    room: "Kitchen",
    headline: "The quiet engine",
    copy: "A monolithic island in honed stone, a hidden scullery beyond. Everything essential, nothing on display.",
    tone: "cool-interior",
    specs: [
      { label: "Island", value: "5 m single slab" },
      { label: "Beyond", value: "Full working scullery" },
    ],
    media: "/assets/tour/kitchen.mp4",
  },
  {
    id: "bedroom",
    index: "06",
    room: "Primary Bedroom",
    headline: "A room for waking",
    copy: "The suite faces east. Motorised blinds lift at dawn to a wall of valley and sky, uninterrupted.",
    tone: "dawn",
    specs: [
      { label: "Aspect", value: "Due east" },
      { label: "Suite", value: "Dressing + study" },
    ],
    media: "/assets/tour/bedroom.mp4",
  },
  {
    id: "bathroom",
    index: "07",
    room: "Bathroom",
    headline: "Stone, water, silence",
    copy: "A carved stone tub sits in its own glazed alcove, open to a private courtyard garden.",
    tone: "marble",
    specs: [
      { label: "Tub", value: "Single-block stone" },
      { label: "Opens to", value: "Private courtyard" },
    ],
    media: "/assets/tour/bathroom.mp4",
  },
  {
    id: "terrace",
    index: "08",
    room: "Balcony / Terrace",
    headline: "The edge of the house",
    copy: "The terrace cantilevers over the slope. A mirror-still pool draws the horizon back toward the living room.",
    tone: "dusk",
    specs: [
      { label: "Pool", value: "18 m infinity edge" },
      { label: "Cantilever", value: "6 m over the slope" },
    ],
  },
];
