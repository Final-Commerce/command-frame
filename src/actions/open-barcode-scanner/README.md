# openBarcodeScanner

Opens the device's camera barcode scanner: the one behind the register's camera button on an Adyen S1F4 Pro or S1F2
running Final POS. The scanned code is not returned. It reaches the register exactly as a hardware scanner's would:
typed into the focused field, or otherwise added to the cart.

## Parameters

None

## Response

```typescript
{
  success: boolean;
  timestamp: string;
}
```

Resolves once the scanner is open, not when a code is read. Closing the scanner without a scan sends nothing.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// A "Scan" button in a flow
await command.openBarcodeScanner();
```

## Error Handling

Rejects, and opens nothing, when:

- the device has no camera scanner (any device other than an S1F4 Pro or S1F2 with a back camera, or a web browser);
- the register can't take a scan right now (it is loading, offline before sign-in, or not on screen);
- a scanner is already open.
