import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5179,
    host: true,
    fs: {
      // port-louis source + the pos-brain symlink live above the example root
      // (`../../port-louis/src`, `../../pos-brain`). Allow the dev server to serve
      // the workspace root so those files (incl. the DB/sync workers) load.
      allow: ['../..'],
    },
  },
  plugins: [react()],
  // The DB/sync workers are spawned as `{ type: 'module' }` — match render: emit ES
  // workers so `new Worker(new URL('./worker.ts', import.meta.url))` resolves.
  worker: {
    format: 'es',
  },
  // pos-brain (built dist, symlinked) and port-louis (source) both reach the
  // `new Worker(new URL('./worker.ts', import.meta.url))` pattern in
  // port-louis/src/db/index.ts. esbuild's dep pre-bundling does NOT apply Vite's
  // worker-URL transform, so the literal URL would leak to the browser and 404 to
  // the SPA fallback ("non-JavaScript MIME type text/html"). Excluding them keeps
  // both on Vite's plugin pipeline, where the worker transform runs.
  optimizeDeps: {
    exclude: ['@final-commerce/pos-brain', '@final-commerce/port-louis'],
    // Excluding pos-brain/port-louis means Vite's startup scan never crawls into
    // them, so their leaf deps (only reached at Boot) would be discovered at
    // runtime — triggering a full "new dependencies optimized" page reload that
    // wipes the harness state. Pre-bundle them up front so the first Boot doesn't
    // reload.
    // The COMPLETE set of runtime deps both excluded packages import — pos-brain
    // pulls the redux/react-redux stack, port-louis pulls lokijs/socket.io. Missing
    // even one makes Vite discover it on first Boot and force-reload.
    include: [
      '@reduxjs/toolkit',
      'react-redux',
      'redux',
      'lokijs',
      'lokijs/src/incremental-indexeddb-adapter.js',
      'socket.io-client',
      'engine.io-client',
      'jwt-decode',
      'uuid',
      '@sentry/react',
    ],
  },
  resolve: {
    // Dedupe singletons across the example + the linked pos-brain/port-louis source
    // (each brings its own node_modules; a second React copy breaks hooks, a second
    // lokijs/socket.io copy breaks the DB worker + sync). Mirrors render.
    dedupe: [
      'react',
      'react-dom',
      'react-redux',
      'socket.io-client',
      'engine.io-client',
      'lokijs',
    ],
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      // In-process harness (Topology B): route the example's command-frame CLIENT
      // through the shim, which swaps `renderClient` for the pos-brain in-process
      // client. `*-real` points at the genuine package so the shim can re-export it.
      {
        find: '@final-commerce/command-frame-real',
        replacement: path.resolve(__dirname, '../dist/index.js'),
      },
      {
        find: '@final-commerce/command-frame',
        replacement: path.resolve(__dirname, './src/harness/commandFrameShim.ts'),
      },
      // Consume port-louis from SOURCE (like render), not its built `dist`. Source
      // ships the real `db/worker.ts` + `sync/syncWorker.ts`, so Vite's worker-URL
      // transform resolves them directly — no `.ts`→`.js` redirect needed, and no
      // MIME 404 from a worker file that only exists as `.js` in `dist`.
      {
        find: /^@final-commerce\/port-louis\/(.*)$/,
        replacement: path.resolve(__dirname, '../../port-louis/src/$1'),
      },
      {
        find: /^@final-commerce\/port-louis$/,
        replacement: path.resolve(__dirname, '../../port-louis/src'),
      },
    ],
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
  },
});
