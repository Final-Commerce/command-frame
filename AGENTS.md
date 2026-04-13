# AGENTS.md — @final-commerce/command-frame

## Project Overview

This is **`@final-commerce/command-frame`**, a TypeScript library for type-safe iframe ↔ host communication. It enables third-party extensions to interact with Final Commerce host applications (Render POS, Manage Dashboard) via `postMessage`.

The library provides four capabilities:

| Capability | Scope | Description |
|---|---|---|
| **Commands** | Request/response | Typed function calls from iframe → host (e.g. `getProducts`, `cashPayment`) |
| **Pub/Sub** | Page-scoped | Subscribe to real-time events from the host (cart changes, payments, etc.) |
| **Hooks** | Session-scoped | Register serialized callbacks that persist across page navigation |
| **Extension Refunds** | Host → iframe | Render asks the extension to reverse redeem/gift-card payments |

Published to both npm (`@final-commerce/command-frame`) and GitHub Packages.

## Tech Stack

- **Language:** TypeScript (strict mode, ES2020 target)
- **Build:** `tsc` (pure TypeScript compiler, no bundler)
- **Tests:** Vitest (Node environment)
- **Formatting:** Prettier (4-space indent, double quotes, no trailing commas, 150 print width)
- **Linting:** ESLint with `@typescript-eslint/recommended-type-checked`
- **Package Manager:** npm

## Repository Structure

```
├── src/
│   ├── index.ts              # Public API barrel — exports `command`, types, clients, topics, hooks
│   ├── client.ts             # CommandFrameClient — iframe-side postMessage request/response + mock mode
│   ├── provider.ts           # CommandFrameProvider — host-side action handler dispatcher
│   ├── CommonTypes.ts        # Re-exports common-types + enums (CurrencyCode, etc.)
│   ├── common-types/         # Shared entity types (products, customers, custom tables, attributes)
│   ├── demo/                 # Mock database + mock data for standalone/dev mode
│   ├── actions/              # ~96 command implementations, one folder per command
│   │   └── <command-name>/   # action.ts, types.ts, mock.ts, README.md
│   ├── pubsub/               # Pub/sub system — TopicSubscriber + topic definitions
│   │   ├── topics.ts         # `topics` singleton API (subscribe/unsubscribe/getTopics)
│   │   ├── subscriber.ts     # TopicSubscriber class
│   │   └── topics/           # Per-domain topic definitions (customers, orders, cart, etc.)
│   ├── hooks/                # Session-scoped hook registration (register/unregister via postMessage)
│   └── projects/             # Environment-specific clients and providers
│       ├── render/           # RenderClient, RenderProvider, RENDER_MOCKS
│       └── manage/           # ManageClient, ManageProvider, MANAGE_MOCKS
├── example/                  # Vite + React demo app (port 5179)
├── docs/                     # LOCAL_LINKING.md
├── .github/workflows/        # publish.yml (tag-triggered, publishes to npm + GitHub Packages)
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Key Architectural Patterns

### Actions (Commands)

Each command lives in its own folder under `src/actions/<kebab-case-name>/`:

| File | Purpose |
|---|---|
| `types.ts` | `Params`, `Response`, and function type interfaces |
| `action.ts` | Implementation — calls `commandFrameClient.call("<wireActionName>", params)` |
| `mock.ts` | Mock handler returning demo data for standalone/dev mode |
| `README.md` | Documentation for the command's wire contract |

When adding a new command:

1. Create `src/actions/<name>/` with `types.ts`, `action.ts`, `mock.ts`, `README.md`
2. Import and add the action function to the `command` object in `src/index.ts`
3. Export the `Params`, `Response`, and function types from `src/index.ts`
4. Register the mock in `src/projects/render/mocks.ts` and/or `src/projects/manage/mocks.ts`
5. Add the action to the appropriate project types in `src/projects/render/types.ts` or `src/projects/manage/types.ts`

### Client / Provider (postMessage Protocol)

- **`CommandFrameClient`** (`src/client.ts`): Iframe-side. Sends `PostMessageRequest` (action + params + requestId) to `window.top`, manages pending request map with timeouts. Uses a `Proxy` so `client.getProducts()` maps to `client.call("getProducts")`. Supports mock mode with a `mockRegistry` for standalone development.
- **`CommandFrameProvider`** (`src/provider.ts`): Host-side. Listens for incoming `PostMessageRequest` messages, dispatches to registered `ActionHandler` functions, and replies with `PostMessageResponse`. Supports origin validation (exact, wildcard subdomain, or `*`).

### Projects (Render vs. Manage)

Each project under `src/projects/<name>/` provides:

- `types.ts` — which actions the host environment exposes
- `mocks.ts` — default mock registry (`RENDER_MOCKS` / `MANAGE_MOCKS`)
- `client.ts` — typed client extending `CommandFrameClient` with pre-wired mocks
- `provider.ts` — typed provider for host implementations

### Pub/Sub

- `src/pubsub/topics.ts` exports a singleton `topics` API with `subscribe`, `unsubscribe`, `unsubscribeAll`, `getTopics`
- `src/pubsub/subscriber.ts` implements `TopicSubscriber` which exchanges messages with the host (`pubsub-request-topics`, `pubsub-event`)
- `src/pubsub/topics/<domain>/` defines per-domain `TopicDefinition` objects and typed event payloads
- Domains: cart, customers, orders, payments, products, refunds, print, custom-tables, outlet, station, session, users

When adding a new topic or event type:

1. Create or extend a domain folder under `src/pubsub/topics/<domain>/`
2. Define `TopicDefinition` in `index.ts` and event payload types in `types.ts`
3. Export from `src/pubsub/topics/index.ts` and `src/index.ts`

### Hooks

- `src/hooks/index.ts` exports a `hooks` object with `register(topic, callback, options)` and `unregister(hookId)`
- Callbacks are serialized via `.toString()` and sent to the host — they must be self-contained (no closures or imports)
- `hookId` is used for deduplication; re-registering with the same ID replaces the previous hook

### Common Types

- `src/common-types/` contains shared entity types used across actions and topics
- `src/CommonTypes.ts` re-exports everything from `common-types/` plus shared enums

## Development

### Build

```bash
npm run build          # Compile TypeScript
npm run build:clean    # Clean dist/ and rebuild
npm run dev            # Watch mode
```

### Test

```bash
npm test               # Vitest in watch mode
npm run test:run       # Single run
```

Tests live alongside source files as `*.test.ts`. The test pattern mocks `../../client` and asserts `commandFrameClient.call` is invoked with the correct wire action name and parameters. See `src/actions/extension-payment/extension-payment.test.ts` for the canonical example.

### Format & Lint

```bash
npm run format         # Prettier write
npm run format:check   # Prettier check (CI)
```

### Example App

```bash
cd example
npm install
npm run dev            # Starts on port 5179
```

The example app is a Vite + React interactive demo that exercises `command.*` calls, pub/sub subscriptions, and manage-mode functionality. It references the library via `file:..` during local development.

## CI/CD

The sole CI workflow is `.github/workflows/publish.yml`:

- **Trigger:** Git tag push matching `v*`
- **Steps:** Validate semver, compare with previous tag, `npm ci`, inject version into `package.json`, publish to GitHub Packages, publish to npm, commit version bump to default branch with `[skip ci]`
- **Node version:** 22
- **No CI test or lint jobs** — tests and linting are developer-local responsibilities

## Code Style

- Double quotes, semicolons, 4-space indentation
- No trailing commas
- 150-character print width
- Arrow parens: avoid where possible (`x => x` not `(x) => x`)
- See `.prettierrc` for the full Prettier configuration

## Key Files

| File | What It Does |
|---|---|
| `src/index.ts` | Public API barrel — the `command` object, all type exports, client/provider/topics/hooks exports |
| `src/client.ts` | `CommandFrameClient` class — iframe-side postMessage communication |
| `src/provider.ts` | `CommandFrameProvider` class — host-side message handler |
| `src/CommonTypes.ts` | Shared entity types and enums |
| `src/demo/database.ts` | Mock database and `setMockDatabase` for overriding demo data |
| `src/projects/render/` | Render POS client, provider, mocks, and type definitions |
| `src/projects/manage/` | Manage Dashboard client, provider, mocks, and type definitions |
| `src/pubsub/topics.ts` | Pub/sub singleton API |
| `src/hooks/index.ts` | Session-scoped hooks API |
