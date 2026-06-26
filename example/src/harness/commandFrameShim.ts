// command-frame shim for the in-process harness.
//
// vite aliases `@final-commerce/command-frame` to this file (see vite.config.ts),
// so every `import { ... } from "@final-commerce/command-frame"` in the example
// app's sections resolves here. We re-export the REAL package verbatim
// (`@final-commerce/command-frame-real`, a second alias pointing at the built
// package) EXCEPT for `renderClient`, which we replace with the in-process client
// that routes to pos-brain's handlers.
//
// Net effect: the existing sections (`import { renderClient as command }`) drive
// pos-brain in-process with zero per-section edits.

export * from "@final-commerce/command-frame-real";
export { renderClient } from "./posBrainHarness";
