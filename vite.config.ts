import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    rollupOptions: {
      output: {
        // Keep the scroll-choreography engine out of the initial route chunk.
        manualChunks: {
          gsap: ["gsap", "@gsap/react"],
        },
      },
    },
  },
});
