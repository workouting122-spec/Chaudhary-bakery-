/**
 * SINGLE SOURCE OF TRUTH for brand + contact details.
 * ▶▶ Replace every PLACEHOLDER with the client's real details before launch. ◀◀
 */
export const site = {
  name: "Meridian",
  fullName: "Meridian Private Residences",
  tagline: "A residence, revealed by scroll",
  established: "Est. MMXXV", // PLACEHOLDER — set the real founding year

  // Primary conversion action for a premium developer: a private viewing.
  primaryCta: { label: "Book a Private Viewing", href: "/contact" },
  secondaryCta: { label: "Explore the Residence", href: "#tour" },

  phoneDisplay: "+00 000 000 0000", // PLACEHOLDER
  phoneE164: "000000000000", // PLACEHOLDER — digits only, for tel:
  email: "viewings@meridian.example", // PLACEHOLDER

  address: {
    line1: "The Meridian Sales Pavilion", // PLACEHOLDER
    line2: "Address line, City", // PLACEHOLDER
    // Google Maps → Share → Embed a map → paste the src here.
    mapEmbedSrc: "", // PLACEHOLDER — empty renders a styled static locator instead
  },

  social: {
    instagram: "https://instagram.com/", // PLACEHOLDER
    linkedin: "https://linkedin.com/", // PLACEHOLDER
  },
} as const;

export const telLink = () => `tel:+${site.phoneE164}`;
export const mailLink = (subject = "Private viewing enquiry") =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
