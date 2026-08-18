/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 90% of the site lives in these creams (matches the cake photography)
        cream: {
          50: "#FDFCFA",
          100: "#FAF8F5",
          200: "#F4EFE7",
          300: "#F0EBE3",
          400: "#E7DECE",
          500: "#D9CBB3",
        },
        ink: {
          DEFAULT: "#2B2622",
          soft: "#5A524A",
          faint: "#8A7F73",
        },
        // The signboard red — used sparingly for CTAs, logo, accents
        brand: {
          DEFAULT: "#D4122A",
          dark: "#A50E20",
          light: "#E23A4D",
        },
        // Premium touches: dividers, badges, hover states
        gold: {
          DEFAULT: "#C6A15B",
          soft: "#D8BE8B",
          dark: "#9C7C3E",
        },
        veg: "#2E8B2E",
        // Cinematic film palette — the dark chocolate world the storefront is born from
        choc: {
          950: "#120A06",
          900: "#1B0E08",
          800: "#2A170E",
          700: "#3E2517",
          600: "#573620",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2rem, 4.5vw, 3.25rem)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
      },
      maxWidth: { content: "1280px" },
      boxShadow: {
        soft: "0 20px 50px -20px rgba(43,38,34,0.25)",
        card: "0 10px 30px -12px rgba(43,38,34,0.18)",
        lift: "0 24px 60px -24px rgba(43,38,34,0.35)",
        stand: "0 40px 60px -30px rgba(43,38,34,0.45)",
      },
      letterSpacing: { widest2: "0.28em" },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scroll-line": {
          "0%": { transform: "scaleY(0)", transformOrigin: "top" },
          "40%": { transform: "scaleY(1)", transformOrigin: "top" },
          "60%": { transform: "scaleY(1)", transformOrigin: "bottom" },
          "100%": { transform: "scaleY(0)", transformOrigin: "bottom" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.22,1,0.36,1) both",
        "scroll-line": "scroll-line 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
