# @final-commerce/command-frame

Command Frame library: public action definitions (add-cart-discount, get-products, cash-payment, etc.) and the message-bus contract used between POS terminals and host/extension iframes.

## Stack

- Language: TypeScript
- Build: `tsc` (emits to `dist/`, `main: dist/index.js`, `types: dist/index.d.ts`)
- Runtime/hosting: npm package `@final-commerce/command-frame` — published to both npmjs.org and GitHub Packages (two `publish:*` scripts).

## Layout

- `src/actions/` — one folder per public action (`add-cart-discount/`, `get-products/`, `cash-payment/`, ...); each holds an `action.ts` the barrel imports.
- `src/common-types/` — shared types used across actions.
- `src/types/` — top-level message/bridge types.
- `src/hooks/` — React hook helpers for Command Frame consumers.
- `src/pubsub/` — pub/sub primitives for the topic bus.
- `src/projects/` — per-project scoped action bundles.
- `src/demo/` — example / playground wiring.
- `example/`, `docs/` — consumer examples and design notes.

Entry point: `src/index.ts` (→ `dist/index.js` via `main` / `types: dist/index.d.ts`).

## Cross-repo deps

- No `@final-commerce/*` runtime or peer deps — this package is framework-light and sits at the bottom of the stack.
- devDeps: typescript ^5, vitest ^3, eslint ^8, prettier ^3.

## Deploy / publish

- npm package `@final-commerce/command-frame` version `0.1.61` — published to both `https://registry.npmjs.org/` (default) and `https://npm.pkg.github.com` (GitHub Packages).
- Consumers: `BuilderHub`, `deerlake`, `manhattan-builder`, `pos-core`, `command-frame-mock-kitchen`, `Render`.

## Conventions / gotchas

- Publishing targets two registries: `npm run publish:npm`, `npm run publish:github`, `npm run publish:all`. `publishConfig.registry` defaults to npmjs.org.
- `prepare` runs `husky && npm run build`, so every `npm install` rebuilds `dist/`.
- Jira commit-msg hook: `jira-prepare-commit-msg` injects ticket IDs from branch names matching `[A-Z]+-\d+`.
- Action folders follow a strict convention: each action has its own directory under `src/actions/<kebab-name>/` with `action.ts` — keep new actions consistent.
