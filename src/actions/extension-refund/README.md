# Extension refund listener (host → iframe)

When a customer pays with a **redeem** / extension-controlled method (`paymentType: "redeem"` on the order), the POS refund flow must **reverse that payment with your provider** before the host finalizes the refund in Render (local transactions, refund record, etc.).

That reversal is **not** a normal Command Frame “command” (iframe → host). The **host** sends a `postMessage` **into** your iframe. Your extension **must** listen for that message and reply.

## Requirement

If your extension uses **`redeemPayment`** / **`extensionPayment`** with `paymentType: "redeem"` (or any flow that results in `paymentType: "redeem"` on the order), you **must** implement this listener (or an equivalent manual handler). Otherwise staff refunds for those tenders will fail or time out.

## Recommended: `installExtensionRefundListener`

```typescript
import {
    installExtensionRefundListener,
    type ExtensionRefundParams,
    type ExtensionRefundResponse
} from '@final-commerce/command-frame';

installExtensionRefundListener(async (params: ExtensionRefundParams): Promise<ExtensionRefundResponse> => {
    // Implement provider refund using params
    return { success: true, extensionTransactionId: 'optional-provider-reference' };
});
```

- Only processes messages where **`event.source === window.top`** (ignores stray `postMessage` sources).
- Validates required fields on `params` before calling your handler.
- Replies to **`event.source`** using **`event.origin`** as the target origin (standard host reply).
- Returns an **unsubscribe** function to remove the listener.

### `ExtensionRefundParams` (incoming)

| Field | Notes |
|--------|--------|
| `paymentType` | e.g. `"redeem"` |
| `processor` | Echo from the original payment (e.g. `"giftCard"`) |
| `amount` | **Major currency units** (not cents), same as the refund UI amount string |
| `saleId` | Local sale transaction id for the original payment |
| `orderId` | Order id when provided by host |
| `referenceId` | Optional, from original sale `paymentData` when stored |
| `metadata` | Optional copy of / extra context from original sale `paymentData` |

### `ExtensionRefundResponse` (your handler return value)

| Field | Notes |
|--------|--------|
| `success` | Business outcome; host continues local refund only when this is `true` |
| `error` | Human-readable message when `success` is `false` |
| `extensionTransactionId` | Optional; forwarded into host refund `paymentData` for reporting / support |

The listener wraps your result in **`PostMessageResponse<ExtensionRefundResponse>`**: `{ requestId, success: true, data: <your result> }`. Transport errors use `{ requestId, success: false, error: string }`.

If your handler returns `{ success: false, error: "..." }`, the host still receives a **successful transport** message but reads `data.success` and **does not** complete the refund (user sees failure).

## Manual implementation (no helper)

If you do not use `installExtensionRefundListener`, listen for `message` and handle payloads where:

- `data.action === EXTENSION_REFUND_REQUEST_ACTION` (string value: **`"extensionRefundRequest"`** — import **`EXTENSION_REFUND_REQUEST_ACTION`** from `@final-commerce/command-frame` to stay in sync).
- `data.requestId` is a string (must be echoed in the response).
- `data.params` matches **`ExtensionRefundParams`**.

Reply with **`PostMessageResponse`** to **`event.source`**:

```typescript
event.source.postMessage(
    {
        requestId: data.requestId,
        success: true,
        data: { success: true, extensionTransactionId: '...' }
    },
    event.origin
);
```

On failure:

```typescript
event.source.postMessage(
    { requestId: data.requestId, success: false, error: 'Reason here' },
    event.origin
);
```

## Host (Render) behavior (reference)

The host registers the flow iframe’s `contentWindow` and sends the request with a timeout. You do not configure that from the extension; ensure your app is loaded **inside** that iframe when refunds run.

**Local mock without Render:** the repo’s **`example/`** app registers `installExtensionRefundListener` in `main.tsx` and ships **`example/public/host-simulator.html`**: open `http://localhost:5179/host-simulator.html` while `npm run dev` is running in `example/` to simulate the parent posting `extensionRefundRequest`.

## Types & exports

From `@final-commerce/command-frame`:

- `installExtensionRefundListener`
- `EXTENSION_REFUND_REQUEST_ACTION`
- `ExtensionRefundParams`, `ExtensionRefundResponse` (types)
- `PostMessageResponse` (response envelope)

Source: `src/actions/extension-refund/` (`types.ts`, `constants.ts`, `extension-refund-listener.ts`).
