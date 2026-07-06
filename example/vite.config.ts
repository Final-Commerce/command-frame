import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
// Clean consumer config: kaching is a published package (@final-commerce-internal/kaching)
// booted via `new Kaching().start()` (see src/kaching-boot.ts) — no source aliases,
// no command-frame shim, no dedupe/optimizeDeps hacks, no build-time plugin.
export default defineConfig({
  server: {
    port: 5179,
    host: true,
  },
  plugins: [react()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
  },
});
