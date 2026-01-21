# print

Prints content to a connected printer or opens the browser print dialog. Supports multiple print types: images, HTML content, DOM elements via selectors, and receipts.

## Parameters

```typescript
interface PrintParams {
    type: "image" | "html" | "selector" | "receipt";
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

#### 2. HTML Print (`type: "html"`)

Prints HTML content by rendering it and converting to an image (native) or opening print dialog (web).

```typescript
{
    type: "html",
    data: {
        html: "<div><h1>Hello World</h1><p>This will be printed</p></div>"
    }
}
```

#### 3. Selector Print (`type: "selector"`)

Prints an existing DOM element by query selector.

```typescript
{
    type: "selector",
    data: {
        selector: "#my-printable-element"
    }
}
```

#### 4. Receipt Print (`type: "receipt"`)

Prints a receipt using the existing receipt printing system.

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
    type: "image" | "html" | "selector" | "receipt";
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

### Print DOM Element

```typescript
import { command } from "@final-commerce/command-frame";

await command.print({
    type: "selector",
    data: {
        selector: "#invoice-container"
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
- **HTML printing**: HTML is rendered in a temporary container. For native apps, it's converted to an image via html2canvas. For web, a print window is opened.
- **Selector printing**: The element must exist in the DOM when the command is called. The element is cloned before printing to avoid modifying the original.
- **Receipt printing**: Uses the existing receipt printing system with global block templates.
- **Error handling**: If a selector is not found, an error will be thrown. Invalid HTML may cause rendering issues.

## Events

This action publishes events on the `print` topic:

- `print-started` - Published when a print action is initiated
- `print-completed` - Published when a print action completes successfully
- `print-error` - Published when a print action encounters an error

For detailed information about print events, including payload structures and subscription examples, see the [print topic documentation](https://github.com/Final-Commerce/command-frame/blob/main/src/pubsub/topics/print/README.md).

## Error Handling

The command will throw an error if:

- Required parameters are missing
- Selector does not match any element (for selector type)
- Image data is invalid (for image type)
- HTML cannot be rendered (for html type)
