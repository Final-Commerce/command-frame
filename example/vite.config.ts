import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5179,
    host: true,
  },
  plugins: [react()],
  resolve: {
    // Dedupe React across the example + the linked pos-brain/command-frame builds
    // (file: deps bring their own node_modules; a second React copy breaks hooks).
    dedupe: ['react', 'react-dom', 'react-redux'],
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
      // pos-brain's built `dist` imports port-louis via subpaths
      // (`@final-commerce/port-louis/sync`, `/db`, …). port-louis ships no
      // `exports` map and exposes those only under `dist/`, so map the subpaths
      // (and the bare specifier) to its built output.
      {
        find: /^@final-commerce\/port-louis\/(.*)$/,
        replacement: path.resolve(__dirname, '../../port-louis/dist/$1'),
      },
      {
        find: /^@final-commerce\/port-louis$/,
        replacement: path.resolve(__dirname, '../../port-louis/dist/index.js'),
      },
      // port-louis' built DB manager spawns its worker via
      // `new Worker(new URL('./worker.ts', import.meta.url))`, but its `dist` only
      // ships the compiled `worker.js`. Redirect the stale `.ts` worker URL to the
      // built worker so the bundler (and the dev server) can resolve it.
      {
        find: path.resolve(__dirname, '../../port-louis/dist/db/worker.ts'),
        replacement: path.resolve(__dirname, '../../port-louis/dist/db/worker.js'),
      },
      {
        find: path.resolve(__dirname, '../../port-louis/dist/sync/syncWorker.ts'),
        replacement: path.resolve(__dirname, '../../port-louis/dist/sync/syncWorker.js'),
      },
    ],
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
  },
});

