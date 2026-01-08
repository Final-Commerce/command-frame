# Example App for @final-commerce/command-frame

This is an example application demonstrating how to use the `@final-commerce/command-frame` library in a React + Vite application.

**Note:** This example is based on a standard Vite + React + TypeScript template, with the `@final-commerce/command-frame` library added to demonstrate its usage.

## Overview

This example app shows how to:
- Import and use the `command` API from the library
- Call actions on the parent window from within an iframe
- Handle responses and errors
- Display data received from parent window actions

## Getting Started

1. Navigate to the example directory:
```bash
cd example
```

2. Install dependencies:

```bash
npm install
npm install @final-commerce/command-frame
```

**Note:** This package is available on the public NPM registry.

3. Start the development server:
```bash
npm run dev
```

4. The app will be available at `http://localhost:5179` (or the port shown in the terminal)

## Using the Library

The example demonstrates using the `@final-commerce/command-frame` library:

```typescript
import { command } from '@final-commerce/command-frame';

// Call an action
const result = await command.exampleFunction({
  param1: 'value1',
  param2: 'value2',
  param3: 'value3',
});

// Get products
const products = await command.getProducts({});

// Get customers (with pagination)
const customers = await command.getCustomers({
    offset: 0,
    limit: 100
});

// Get categories
const categories = await command.getCategories({});

// Get product variants
const variants = await command.getProductVariants({
    productId: 'product-id-123'
});

// Add a custom sale
await command.addCustomSale({
    label: 'Service',
    price: 100,
    applyTaxes: true
});

// Set product active, add discount, and add to cart
await command.setProductActive({
    variantId: 'variant-id-123'
});

await command.addProductDiscount({
    amount: 10,
    isPercent: false,
    label: 'Discount'
});

await command.addProductToCart({
    quantity: 2
});

// Add cart discount
await command.addCartDiscount({
    amount: 10,
    isPercent: false,
    label: 'Cart Discount'
});

// Get current context/environment
const context = await command.getContext();
console.log('Current user:', context.userId);
console.log('Current company:', context.companyName);
console.log('Full user object:', context.user);
console.log('Full company object (without settings):', context.company);
console.log('Full station object:', context.station);
console.log('Full outlet object:', context.outlet);

// Product Actions
await command.addProductNote({ note: 'Customer requested extra packaging' });
await command.addProductFee({ amount: 5.00, label: 'Service Fee', applyTaxes: true });
await command.adjustInventory({ amount: '10', stockType: 'add' });

// Order Actions
await command.addOrderNote({ note: 'Delivery by 3pm' });
await command.addCartFee({ amount: 5.00, label: 'Processing Fee' });
await command.clearCart();
await command.parkOrder();
await command.resumeParkedOrder({ orderId: 'order-123' });
await command.deleteParkedOrder({ orderId: 'order-123' });
await command.cashPayment({ amount: 50.00 });
await command.tapToPayPayment();
await command.terminalPayment();
await command.vendaraPayment();
await command.partialPayment({ amount: 25.00, isPercent: false });

// Refund Actions
await command.initiateRefund({ orderId: 'order-123' });

// Customer Actions
await command.addCustomerNote({ customerId: 'customer-123', note: 'VIP customer' });
await command.removeCustomerFromCart();

// System Actions
await command.goToStationHome();
await command.goToPage({ pageId: 'page-123' });
await command.openCashDrawer();
await command.openPopup({ popupId: 'popup-123' });
await command.showNotification({ message: 'Order completed!' });
await command.toggleSlideOut({ slideOutId: 'slideout-123' });
await command.showConfirmation({ message: 'Are you sure?' });
await command.authenticateUser({ roleIds: ['role-123'] });
await command.updateCustomerFacingDisplay({ pageId: 'page-123' });
await command.switchUser({ mode: 'dialog' });
await command.switchUser({ mode: 'role', roleIds: ['role-123'] });
await command.switchUser({ mode: 'specific', userId: 'user-123' });

// Integration Actions
await command.triggerWebhook({
    webhookUrl: 'https://example.com/webhook',
    payloadType: 'json'
});
await command.triggerZapierWebhook({
    triggerUrl: 'https://hooks.zapier.com/hooks/catch/123456/abcdef'
});
```

## Testing in an Iframe

This app is designed to run inside an iframe. For production use, you'll typically need HTTPS and a publicly accessible URL. For local development and testing, you can use ngrok to expose your local server.

### Using ngrok (Recommended for Testing)

When testing iframe communication, you usually need:
- **HTTPS** (required for secure iframe communication)
- **Publicly accessible URL** (to embed in parent pages)

ngrok provides both by creating a secure tunnel to your local server.

1. **Install ngrok** (if not already installed):
   
   Download and install ngrok from https://ngrok.com/download

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   Note the port number (usually `5179`)

3. **Start ngrok** in a separate terminal:
   ```bash
   ngrok http 5179
   ```
   (Replace `5179` with your actual port if different)

4. **Copy the HTTPS URL** from ngrok output:
   ```
   Forwarding  https://abc123.ngrok-free.app -> http://localhost:5179
   ```

5. **Use the ngrok URL** in your parent page:
   
   This example app is designed to work in an iframe element. Put the HTTPS URL from ngrok output to the iframe element settings page in your Build.

**Note:** The free ngrok URL changes each time you restart ngrok. For a stable URL, consider using ngrok's paid plan or setting up a custom domain.

## Debugging

Enable debug logging by setting the debug flag before importing:

```typescript
// In main.tsx, before any imports
(window as any).__POSTMESSAGE_DEBUG__ = true;
```

This will log all postMessage communication to the console.
