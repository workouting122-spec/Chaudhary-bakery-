/**
 * SINGLE SOURCE OF TRUTH for client-specific details.
 * ▶▶ Replace every PLACEHOLDER before going live. ◀◀
 * These are the items flagged in PRD §10 "What to Ask Before Coding".
 */
export const site = {
  name: "Chaudhary Bake & Cake",
  tagline: "100% Veg · Eggless",
  sinceYear: "20XX", // PLACEHOLDER — confirm the real "Since" year
  neighborhood: "your neighbourhood", // PLACEHOLDER

  // From the signboard: "9341-XXXXX-2499" — fill the full number.
  phoneDisplay: "+91 93XXX-XX499", // PLACEHOLDER
  phoneE164: "9193XXXXX499", // PLACEHOLDER — digits only, for tel: & wa.me

  // wa.me deep link uses the phone in international format, no "+".
  whatsappNumber: "9193XXXXX499", // PLACEHOLDER
  whatsappGreeting: "Hi Chaudhary Bake & Cake! I'd like to order a cake.",

  address: {
    line1: "Shop address line 1", // PLACEHOLDER
    line2: "City, State, PIN", // PLACEHOLDER
    // Map: paste the shop's real embed URL from Google Maps -> Share -> Embed a map
    mapEmbedSrc: "https://www.google.com/maps?q=India&output=embed", // PLACEHOLDER
  },

  hours: [
    { day: "Mon - Sat", time: "9:00 AM - 9:30 PM" },
    { day: "Sunday", time: "10:00 AM - 9:00 PM" },
  ],

  // Pincodes you deliver to (PRD §5.3). Empty array = accept all with a note.
  deliveryPincodes: [] as string[], // PLACEHOLDER e.g. ["302001","302012"]
  deliveryFee: 49,
  freeDeliveryOver: 999,

  social: {
    instagram: "https://instagram.com/", // PLACEHOLDER
    facebook: "https://facebook.com/", // PLACEHOLDER
  },
} as const;

export const waLink = (message: string = site.whatsappGreeting) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const telLink = () => `tel:+${site.phoneE164}`;
