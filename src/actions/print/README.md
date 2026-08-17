# print

Prints a pre-rasterized **image** to the station's printer(s).

> **Only `type: "image"` is supported.** `type: "html"` and `type: "receipt"` are **deprecated** — rasterize your receipt/label markup yourself and print it as an image. `image` is also the only path that carries multi-printer tag routing reliably.

## Parameters

```typescript
interface PrintParams {
    type: "image" | "html" | "receipt";
    data: PrintData;
    options?: PrintOptions;
}
```

### Print Types

#### 1. Image Print (`type: "image"`)

Prints a base64-encoded image directly.

```typescript
{
    type: "image",
    data: {
        image: "data:image/png;base64,iVBORw0KGgoAAAANS..."
    }
}
```

#### 2. HTML Print (`type: "html"`) — **DEPRECATED**

> **Deprecated — use `type: "image"`.** The native path posts raw HTML to the shell (no html2canvas, no sanitization) and `PrintOptions` may be dropped. Rasterize your HTML to a base64 image and print that instead.

```typescript
{
    type: "html",
    data: {
        html: "<div><h1>Hello World</h1><p>This will be printed</p></div>"
    }
}
```

#### 3. Receipt Print (`type: "receipt"`) — **DEPRECATED**

> **Deprecated — use `type: "image"`.** The station **requires** `order` (no active-order fallback and it throws without one), **ignores** `globalBlockId` (no global-block templates), and **drops all `PrintOptions`** including tag routing. Compose + rasterize your receipt and print it as an image.

```typescript
{
    type: "receipt",
    data: {
        order: { /* ActiveOrder without _id */ },
        globalBlockId?: "optional-global-block-id"
    }
}
```

### Options

Optional print settings:

```typescript
interface PrintOptions {
    margins?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
    paperSize?: string;
    width?: string;
}
```

## Response

```typescript
{
    success: boolean;
    timestamp: string;
    type: "image" | "html" | "receipt";
}
```

## Usage

### Print an Image

```typescript
import { command } from "@final-commerce/command-frame";

// Convert image to base64 first
const imageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANS...";

await command.print({
    type: "image",
    data: { image: imageBase64 }
});
```

### Print HTML Content

```typescript
import { command } from "@final-commerce/command-frame";

await command.print({
    type: "html",
    data: {
        html: `
            <div>
                <h1>Invoice</h1>
                <p>Order #12345</p>
                <p>Total: $99.99</p>
            </div>
        `
    },
    options: {
        margins: { top: 10, right: 10, bottom: 10, left: 10 }
    }
});
```

### Print Receipt

```typescript
import { command } from "@final-commerce/command-frame";

const currentCart = await command.getCurrentCart();
// Convert cart to order format...

await command.print({
    type: "receipt",
    data: {
        order: orderData,
        globalBlockId: "optional-receipt-template-id"
    }
});
```

## Notes

- **Image printing**: The image must be base64-encoded. For native apps, the image is sent directly to the printer. For web, a print dialog is opened.
- **HTML printing** (deprecated): on web a print window opens; on native the raw HTML is posted to the shell — it is NOT converted via html2canvas and is not sanitized. Prefer `type: "image"`.
- **Receipt printing** (deprecated): composes a minimal receipt from the order and rasterizes it; `globalBlockId` is ignored and all `PrintOptions` (margins/width/tag) are dropped. Prefer `type: "image"`.
- **Error handling**: Invalid HTML may cause rendering issues.

## Error Handling

The command will throw an error if:

- Required parameters are missing (`[pos-brain] print requires params`)
- (receipt, deprecated) no `order` payload was provided
