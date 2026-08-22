import { defineConfig } from 'vite';

// Static site: everything real lives in public/ and is referenced with
// absolute /paths, so the build simply copies it into dist/ untouched.
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'build',   // keep Vite's own output away from /assets (our media)
    emptyOutDir: true
  }
});
