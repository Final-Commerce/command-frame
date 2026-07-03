# Interceptors

Interceptors let an installed extension **gate a POS flow** at a named point — approve, modify, or stop an operation before it proceeds. Where [hooks](../hooks/README.md) are fire-and-forget notifications, interceptors are **blocking**: the host waits for your interceptor and acts on what it returns.

## How it works

1. Your extension registers an interceptor for a point (e.g. `refund_start`). Registration mirrors hooks: the callback is serialized and runs **on the host**, so it must be **self-contained** — it may use only its `payload` argument and the injected `cmds` / `callCommand`. It cannot reference your page's variables or DOM.
2. When the host reaches that point, it runs **every** installed extension's interceptor for it, in turn.
3. The flow **stops** if any interceptor returns `false`. Otherwise it continues; any object you return is **merged** into the flow payload.
4. If your interceptor throws or doesn't respond in time, the host **fails closed** (treats it as stop) — important for money-sensitive flows like refunds.

## Register

```ts
import { interceptors } from "@final-commerce/command-frame";

interceptors.register(
  "refund_start",
  async (payload, cmds) => {
    // payload.paymentTypes lists every refund leg's payment type, e.g. ["card", "redeem"]
    if (payload.paymentTypes.includes("redeem")) {
      // this refund touches a payment type we handle → show our UI and return its outcome
      return cmds.openExtensionOverlay({ point: "refund_start", payload });
    }
    return true; // nothing for us to do → let the refund proceed
  },
  { interceptorId: "my-ext.refund-guard" } // stable id; re-registering replaces it
);
```

### Return contract

| You return | Effect |
|---|---|
| `false` | Stop the flow |
| `true` (or nothing) | Continue, no data |
| an object | Continue, and merge the object into the flow payload |

## Showing UI (overlay)

If you need the cashier to decide, open an overlay. The host pauses the flow, shows your extension's UI in an overlay iframe, and resumes when you report an outcome. The overlay has **no timeout** — it waits for the user.

```ts
// in your interceptor (runs on the host) — open the overlay and return its outcome
interceptors.register(
  "refund_start",
  async (payload, cmds) => cmds.openExtensionOverlay({ point: "refund_start", payload }),
  { interceptorId: "my-ext.refund-approval" }
);
```

```ts
// in your overlay UI (the same bundle, opened as an overlay)
interceptors.onOverlay(({ point, payload }) => {
  renderApprovalUI(payload);          // your UI; payload has the order + refund details
});

// when the user acts:
interceptors.resolve({ approvedBy }); // continue + merge data
interceptors.proceed();               // continue, no data
interceptors.cancel();                // stop the refund
```

Closing the overlay without reporting an outcome (or not responding) **stops** the flow (fail-closed).

> One bundle, two modes: the same extension URL is loaded for registration and, when needed, as the overlay. The SDK tells the two apart — call `register` at load and provide an `onOverlay` handler for the UI.

## Available points

| Point | Fires | Payload | Effect of `false` / returned data |
|---|---|---|---|
| `refund_start` | **Before a refund is executed** — after the cashier confirms in the refund popup, just before money moves. All refund paths (popup, barcode, split-tender) converge here; it is **not** fired merely by opening the refund screen. | `{ order, refund, paymentTypes }` — `order` is the full active order; `refund` is the refund plan about to run (amounts, line selections, `legs`, `reason`, `refundId`); `paymentTypes` is the list of each leg's payment type (e.g. `["card","redeem"]`). | `false` aborts the refund (no money moves); a returned object is merged into the refund flow |

_This table is the source of truth for authors and is kept in sync with the `InterceptorPoint` type and the host's point registry._

## Self-Contained Constraint

The callback is **serialized** via `.toString()` and **reconstructed** in the host with `new Function()`. It must be **self-contained**:

- **Allowed:** Use `payload`, `cmds`, and `callCommand` only.
- **Not allowed:** Closures, imports, or references to extension-local variables. These will cause `ReferenceError` at runtime.
- **Not allowed:** Module-only globals such as `import.meta`, dynamic `import()`, or top-level `await`. The host runs the reconstructed function in global scope (not an ES module).

If you need configuration values (e.g. an API URL), encode them as literals inside the function body.

## API Reference

### `interceptors.register(point, callback, options)`

Registers a session-scoped interceptor for a named point. The callback is serialized and sent to the host.

**Parameters:**
- `point: InterceptorPoint` - The point to intercept (e.g. `'refund_start'`)
- `callback: InterceptorFunction` - The function to run. Receives `(payload, cmds, callCommand)`.
- `options: InterceptorRegisterOptions` - Required options object:
  - `interceptorId: string` (required) - Stable identifier for deduplication; re-registering with the same id replaces the previous one
  - `timeoutMs?: number` - Per-interceptor timeout override (ms)

**Returns:** `string` - The `interceptorId`

### `interceptors.unregister(interceptorId)`

Removes an interceptor by its ID.

### `interceptors.onOverlay(handler)`

Registers a handler invoked when this iframe is opened as an overlay by the host. Call this once at load alongside your `register` calls.

**Parameters:**
- `handler: (ctx: InterceptorOverlayContext) => void` - Receives `{ point, payload }` when the overlay opens

### `interceptors.resolve(data)`

Report from an overlay: continue the gated flow and merge `data` into the flow payload.

### `interceptors.proceed()`

Report from an overlay: continue the gated flow with no data.

### `interceptors.cancel()`

Report from an overlay: stop the gated flow.

## Types

```typescript
type InterceptorPoint = "refund_start";

type InterceptorReturn<T extends Record<string, any> = Record<string, any>> = boolean | T;

type InterceptorFunction = (
    payload: any,
    cmds: InterceptorHostCommands,
    callCommand: (action: string, params?: any) => Promise<any>
) => InterceptorReturn | Promise<InterceptorReturn>;

interface InterceptorRegisterOptions {
    /** Stable id; re-registering with the same id replaces the previous one. */
    interceptorId: string;
    /** Per-interceptor timeout override (ms). */
    timeoutMs?: number;
}

interface InterceptorOverlayContext {
    point: InterceptorPoint;
    payload: any;
}
```
