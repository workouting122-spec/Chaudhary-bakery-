/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Architectural charcoals — the "night exterior" the whole journey sits in.
        ink: {
          950: "#0A0B0D",
          900: "#0E0F12",
          800: "#14161A",
          700: "#1B1E23",
          600: "#24282F",
          500: "#2F343C",
        },
        // Warm off-whites — plaster, limestone, printed paper.
        bone: {
          DEFAULT: "#F3EFE7",
          soft: "#E7E1D5",
          muted: "#A9A399",
          faint: "#736E66",
        },
        // Single metallic accent — brass / bronze. Used sparingly.
        brass: {
          DEFAULT: "#B79268",
          light: "#CBA97F",
          soft: "#D8BE97",
          dark: "#8A6A45",
        },
        // Cool architectural secondary for depth (dusk glass).
        slate2: {
          DEFAULT: "#3B4756",
          light: "#5A6b7d",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 9vw, 8rem)", { lineHeight: "0.98", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.5rem, 6vw, 5rem)", { lineHeight: "1.0", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2rem, 4.5vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
      },
      maxWidth: { content: "1320px", reading: "62ch" },
      boxShadow: {
        soft: "0 30px 80px -40px rgba(0,0,0,0.7)",
        card: "0 20px 50px -24px rgba(0,0,0,0.6)",
        lift: "0 40px 90px -40px rgba(0,0,0,0.8)",
      },
      letterSpacing: { widest2: "0.32em", widest3: "0.5em" },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
        cine: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      keyframes: {
        "scroll-line": {
          "0%": { transform: "scaleY(0)", transformOrigin: "top" },
          "40%": { transform: "scaleY(1)", transformOrigin: "top" },
          "60%": { transform: "scaleY(1)", transformOrigin: "bottom" },
          "100%": { transform: "scaleY(0)", transformOrigin: "bottom" },
        },
        "grain-shift": {
          "0%,100%": { transform: "translate(0,0)" },
          "25%": { transform: "translate(-2%, 1%)" },
          "50%": { transform: "translate(1%, -2%)" },
          "75%": { transform: "translate(2%, 2%)" },
        },
      },
      animation: {
        "scroll-line": "scroll-line 2.4s ease-in-out infinite",
        "grain-shift": "grain-shift 8s steps(4) infinite",
      },
    },
  },
  plugins: [],
};
