# @final-commerce/command-frame

A TypeScript library for communication between iframes and their parent windows using postMessage with type safety and error handling. test.

## Installation

```bash
npm install @final-commerce/command-frame
```

This package is available on the public NPM registry.

## Table of Contents

- [API Overview](#api-overview)
- [Quick Start](#quick-start)
- [Commands Documentation](#commands-documentation)
- [Pub/Sub System](#pubsub-system)
- [Examples](#examples)
- [Debugging](#debugging)
- [Type Safety](#type-safety)
- [License](#license)

## API Overview

The library provides a `command` namespace object containing all available commands. Each command is a typed function that communicates with the parent window via postMessage.

### Available Commands

#### Data Retrieval
- **[getCustomers](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-customers/README.md)** - Retrieve a list of customers from the parent application
- **[getProducts](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-products/README.md)** - Retrieve a list of products from the parent application
- **[getCategories](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-categories/README.md)** - Retrieve a list of categories from the parent application
- **[getProductVariants](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-product-variants/README.md)** - Retrieve all variants for a specific product
- **[getOrders](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-orders/README.md)** - Retrieve a list of orders from the system with optional filtering, sorting, and pagination
- **[getCurrentCart](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-current-cart/README.md)** - Retrieve the current cart object with all its contents
- **[getContext](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-context/README.md)** - Get current environment/context information (user, company, device, station, outlet, build)
- **[getFinalContext](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-final-context/README.md)** - Get final context information (project name)

#### Product Actions
- **[addProductToCart](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/add-product-to-cart/README.md)** - Add a product to the cart with optional discounts, fees, and notes
- **[addProductDiscount](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/add-product-discount/README.md)** - Add a discount to a specific product in the cart (using `internalId`)
- **[addProductNote](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/add-product-note/README.md)** - Add a note to a specific product in the cart (using `internalId`)
- **[addProductFee](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/add-product-fee/README.md)** - Add a fee to a specific product in the cart (using `internalId`)
- **[adjustInventory](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/adjust-inventory/README.md)** - Adjust inventory/stock level for a specific product variant

#### Order Actions
- **[addCustomSale](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/add-custom-sale/README.md)** - Add a custom sale item to the cart
- **[addCartDiscount](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/add-cart-discount/README.md)** - Add a discount to the entire cart
- **[addOrderNote](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/add-order-note/README.md)** - Add a note to the current order/cart
- **[addCartFee](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/add-cart-fee/README.md)** - Add a fee to the entire cart
- **[clearCart](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/clear-cart/README.md)** - Clear all items from the current cart
- **[parkOrder](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/park-order/README.md)** - Park (save) the current order for later retrieval
- **[resumeParkedOrder](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/resume-parked-order/README.md)** - Resume a previously parked order
- **[deleteParkedOrder](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/delete-parked-order/README.md)** - Delete a parked order
- **[initiateRefund](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/initiate-refund/README.md)** - Open the refund UI for an order
- **[cashPayment](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/cash-payment/README.md)** - Initiate a cash payment
- **[tapToPayPayment](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/tap-to-pay-payment/README.md)** - Initiate a tap-to-pay payment
- **[terminalPayment](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/terminal-payment/README.md)** - Initiate a terminal payment
- **[vendaraPayment](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/vendara-payment/README.md)** - Initiate a Vendara payment
- **[partialPayment](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/partial-payment/README.md)** - Initiate a partial/split payment

#### Customer Actions
- **[addCustomer](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/add-customer/README.md)** - Add a new customer to the local database
- **[assignCustomer](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/assign-customer/README.md)** - Assign an existing customer to the current session/cart
- **[addCustomerNote](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/add-customer-note/README.md)** - Add a note to a customer's record
- **[removeCustomerFromCart](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/remove-customer-from-cart/README.md)** - Remove the currently assigned customer from the cart

#### System Actions
- **[goToStationHome](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/go-to-station-home/README.md)** - Navigate to the station home page
- **[openCashDrawer](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/open-cash-drawer/README.md)** - Open the cash drawer
- **[showNotification](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/show-notification/README.md)** - Show a notification message
- **[showConfirmation](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/show-confirmation/README.md)** - Show a confirmation dialog
- **[authenticateUser](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/authenticate-user/README.md)** - Trigger user authentication for specific roles
- **[updateCustomerFacingDisplay](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/update-customer-facing-display/README.md)** - Update the customer-facing display to show a specific page
- **[switchUser](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/switch-user/README.md)** - Switch the current user to a different user

#### Refund Actions
- **[getLineItemsByOrder](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-line-items-by-order/README.md)** - Retrieve line items and custom sales from an order for refund purposes
- **[selectAllRefundItems](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/select-all-refund-items/README.md)** - Select all remaining refundable items for a full refund
- **[resetRefundDetails](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/reset-refund-details/README.md)** - Clear all refund selections
- **[setRefundStockAction](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/set-refund-stock-action/README.md)** - Set stock handling option (restock/damage) for a refunded item
- **[calculateRefundTotal](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/calculate-refund-total/README.md)** - Calculate refund total based on current selections
- **[processPartialRefund](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/process-partial-refund/README.md)** - Process a partial refund based on current selections
- **[getRemainingRefundableQuantities](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-remaining-refundable-quantities/README.md)** - Get remaining refundable quantities for items in the active order

#### Integration Actions
- **[triggerWebhook](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/trigger-webhook/README.md)** - Trigger a webhook with the specified configuration
- **[triggerZapierWebhook](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/trigger-zapier-webhook/README.md)** - Trigger a Zapier webhook with the current context data

#### Reference
- **[exampleFunction](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/example-function/README.md)** - Example/template function (for reference only)

For detailed documentation on each command, including parameter descriptions, response structures, and usage examples, see the [Commands Documentation](#commands-documentation) section below.

## Quick Start

```typescript
import { command } from '@final-commerce/command-frame';

// Get products from parent window
const products = await command.getProducts();

// Get customers from parent window
const customers = await command.getCustomers();

// Get categories from parent window
const categories = await command.getCategories();

// Get variants for a product
const variants = await command.getProductVariants({
    productId: '691df9c6c478bada1fb23d31'
});

// Add product to cart with optional discounts and fees
const addedProduct = await command.addProductToCart({
    variantId: '691df9c6c478bada1fb23d55',
    quantity: 1,
    discounts: [{
        amount: 10,
        isPercent: false,
        label: 'Discount'
    }],
    notes: 'No onions'
});

// Add a discount to the specific item just added (if you didn't add it during creation)
await command.addProductDiscount({
    internalId: addedProduct.internalId,
    amount: 5,
    isPercent: true,
    label: 'Extra 5% Off'
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
console.log('Current build:', context.buildName);
```

For complete usage examples and detailed parameter descriptions, see the documentation for each command in the [Commands Documentation](#commands-documentation) section.


## Commands Documentation

Each command has detailed documentation with complete parameter descriptions, response structures, and multiple usage examples:

### [getCustomers](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-customers/README.md)

Retrieves a list of customers from the parent application's local database. Supports MongoDB query syntax for filtering, text search across name/email/phone fields, and pagination.

### [getProducts](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-products/README.md)

Retrieves a list of products from the parent application's local database. Supports filtering by name, SKU, status, product type, categories, tags, and more.

### [addCustomer](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/add-customer/README.md)

Adds a new customer to the local database in the parent application. Supports full customer structure including addresses, metadata, notes, and tags.

### [assignCustomer](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/assign-customer/README.md)

Assigns an existing customer to the current active session/cart. The customer must exist in the local database.

### [getCategories](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-categories/README.md)

Retrieves a list of categories from the parent application's local database. Supports filtering by name, parent ID, and external ID.

### [getProductVariants](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-product-variants/README.md)

Retrieves all variants for a specific product from the parent application's local database. Useful for displaying variant options or selecting a specific variant.

### [getOrders](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-orders/README.md)

Retrieves a list of orders from the system with optional filtering, sorting, and pagination. Supports filtering by status, customer ID, session ID, and text search.

### [getCurrentCart](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-current-cart/README.md)

Retrieves the current cart object with all its contents including products, custom sales, discounts, fees, totals, and customer information.

### [addCustomSale](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/add-custom-sale/README.md)

Adds a custom sale item to the cart in the parent window. Useful for adding non-product items like service fees, discounts, or custom charges.

### [addProductToCart](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/add-product-to-cart/README.md)

Adds a product to the cart. Supports specifying quantity, applying discounts, fees, and notes in a single atomic operation.

### [addProductDiscount](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/add-product-discount/README.md)

Adds a discount to a specific product in the cart (identified by `internalId`). Supports both fixed amount and percentage discounts.

### [addCartDiscount](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/add-cart-discount/README.md)

Adds a discount to the entire cart. Supports both fixed amount and percentage discounts. Applies to the cart subtotal and affects all items.

### [getContext](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-context/README.md)

Retrieves the current environment/context information from the parent application. Returns user, company, device, station, outlet, and build information including IDs, names, and other relevant details.

### Product Actions

### [addProductNote](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/add-product-note/README.md)

Adds a note to a specific product in the cart (identified by `internalId`).

### [addProductFee](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/add-product-fee/README.md)

Adds a fee to a specific product in the cart (identified by `internalId`). Supports both fixed amount and percentage-based fees.

### [adjustInventory](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/adjust-inventory/README.md)

Adjusts the inventory/stock level for a specific product variant. Supports adding, subtracting, or setting stock to a specific value.

### Order Actions

### [addOrderNote](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/add-order-note/README.md)

Adds a note to the current order/cart.

### [addCartFee](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/add-cart-fee/README.md)

Adds a fee to the entire cart. Supports both fixed amount and percentage-based fees.

### [clearCart](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/clear-cart/README.md)

Clears all items from the current cart and resets cart-related state.

### [parkOrder](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/park-order/README.md)

Parks (saves) the current order for later retrieval. The cart is cleared after parking.

### [resumeParkedOrder](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/resume-parked-order/README.md)

Resumes a previously parked order by loading it back into the cart.

### [deleteParkedOrder](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/delete-parked-order/README.md)

Deletes a parked order from the system.

### [initiateRefund](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/initiate-refund/README.md)

Opens the refund UI for the specified order or the currently active order.

### [cashPayment](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/cash-payment/README.md)

Initiates a cash payment for the current cart. Opens the cash payment UI if change calculation is enabled.

### [tapToPayPayment](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/tap-to-pay-payment/README.md)

Initiates a tap-to-pay payment for the current cart. May request tip if tip functionality is enabled.

### [terminalPayment](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/terminal-payment/README.md)

Initiates a terminal payment for the current cart. May request tip if tip functionality is enabled.

### [vendaraPayment](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/vendara-payment/README.md)

Initiates a Vendara payment for the current cart. May request tip if tip functionality is enabled.

### [partialPayment](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/partial-payment/README.md)

Initiates a partial/split payment for the current cart. Can open the split payment UI or process a payment with a specified amount.

### Customer Actions

### [addCustomerNote](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/add-customer-note/README.md)

Adds a note to a customer's record. Requires the customer ID.

### [removeCustomerFromCart](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/remove-customer-from-cart/README.md)

Removes the currently assigned customer from the cart.

### System Actions

### [goToStationHome](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/go-to-station-home/README.md)

Navigates to the station home page.

### [openCashDrawer](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/open-cash-drawer/README.md)

Opens the cash drawer (if connected to a compatible device).

### [showNotification](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/show-notification/README.md)

Shows a notification message to the user.

### [showConfirmation](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/show-confirmation/README.md)

Shows a confirmation dialog to the user. The actual promise resolution (accept/decline) is handled by the parent application's handler system.

### [authenticateUser](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/authenticate-user/README.md)

Triggers user authentication for specific roles. Shows an authentication dialog in the parent application.

### [updateCustomerFacingDisplay](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/update-customer-facing-display/README.md)

Updates the customer-facing display to show a specific page by page ID.

### [switchUser](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/switch-user/README.md)

Switches the current user to a different user. Supports three modes: dialog (select from all users), role (select from users with specific roles), or specific (switch to a specific user).

### Refund Actions

### [getLineItemsByOrder](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-line-items-by-order/README.md)

Retrieves line items and custom sales from an order, along with calculated remaining refundable quantities for each item.

### [selectAllRefundItems](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/select-all-refund-items/README.md)

Selects all remaining refundable items (line items, custom sales, cart fees, and tips) for a full refund.

### [resetRefundDetails](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/reset-refund-details/README.md)

Clears all refund selections (quantities, custom sales, cart fees, tips, and stock actions).

### [setRefundStockAction](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/set-refund-stock-action/README.md)

Sets the stock handling option for a refunded line item (restock or mark as damaged).

### [calculateRefundTotal](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/calculate-refund-total/README.md)

Calculates and returns a preview of the refund total based on current refund selections, without processing the refund.

### [processPartialRefund](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/process-partial-refund/README.md)

Processes a partial refund based on the current refund selections in the refund details state.

### [getRemainingRefundableQuantities](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-remaining-refundable-quantities/README.md)

Gets the remaining refundable quantities for all line items and custom sales in the active order.

### Integration Actions

### [triggerWebhook](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/trigger-webhook/README.md)

Triggers a webhook with the specified configuration. Supports custom data, authentication, and various payload types.

### [triggerZapierWebhook](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/trigger-zapier-webhook/README.md)

Triggers a Zapier webhook with the current context data (cart, customer, order, etc.).

### Reference

### [exampleFunction](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/example-function/README.md)

An example/template function for reference. See the documentation for the structure to follow when creating new commands.

## Pub/Sub System

The library includes a pub/sub system that allows iframe apps to subscribe to topics and receive events published by the host application (Render).

### Available Topics

#### Customer Events
- **[customers](https://github.com/Final-Commerce/command-frame/blob/main/src/pubsub/topics/customers/README.md)** - Customer lifecycle events
  - `customer-created` - Fired when a new customer is created
  - `customer-updated` - Fired when a customer's information is updated
  - `customer-note-added` - Fired when a note is added to a customer
  - `customer-note-deleted` - Fired when a note is deleted from a customer
  - `customer-assigned` - Fired when a customer is assigned to the cart
  - `customer-unassigned` - Fired when a customer is unassigned from the cart

#### Order Events
- **[orders](https://github.com/Final-Commerce/command-frame/blob/main/src/pubsub/topics/orders/README.md)** - Order lifecycle events
  - `order-created` - Fired when a new order is created
  - `order-updated` - Fired when an order is updated

#### Refund Events
- **[refunds](https://github.com/Final-Commerce/command-frame/blob/main/src/pubsub/topics/refunds/README.md)** - Refund lifecycle events
  - `refund-created` - Fired when a refund is created
  - `refund-updated` - Fired when a refund is updated

#### Product Events
- **[products](https://github.com/Final-Commerce/command-frame/blob/main/src/pubsub/topics/products/README.md)** - Product sync events
  - `product-created` - Fired when a product is created
  - `product-updated` - Fired when a product is updated

#### Cart Events
- **[cart](https://github.com/Final-Commerce/command-frame/blob/main/src/pubsub/topics/cart/README.md)** - Cart operation events
  - `cart-created` - Fired when a cart is created
  - `customer-assigned` - Fired when a customer is assigned to the cart
  - `product-added` - Fired when a product is added to the cart
  - `product-deleted` - Fired when a product is removed from the cart
  - `cart-discount-added` - Fired when a discount is added to the cart
  - `cart-discount-removed` - Fired when a discount is removed from the cart
  - `cart-fee-added` - Fired when a fee is added to the cart
  - `cart-fee-removed` - Fired when a fee is removed from the cart

#### Payment Events
- **[payments](https://github.com/Final-Commerce/command-frame/blob/main/src/pubsub/topics/payments/README.md)** - Payment processing events
  - `payment-done` - Fired when a payment is successfully completed
  - `payment-err` - Fired when a payment fails

For detailed documentation on each topic and its events, including payload structures and usage examples, see the [Pub/Sub Documentation](https://github.com/Final-Commerce/command-frame/blob/main/src/pubsub/README.md).

## Examples

See the [example/](https://github.com/Final-Commerce/command-frame/tree/main/example) folder for a working React + Vite demo application that demonstrates how to use this library in a real-world scenario.

To run the example:

```bash
cd example
npm install
npm run dev
```

## Debugging

Enable debug logging by setting the debug flag before importing:

```typescript
(window as any).__POSTMESSAGE_DEBUG__ = true;
import { command } from '@final-commerce/command-frame';
```

This will log all postMessage communication to the console, including:
- Request details (action name, parameters, request ID)
- Response details (success status, data, errors)
- Timing information
- Origin validation

## Type Safety

All commands are fully typed with TypeScript. Import types for use in your code:

```typescript
import type {
    // Data Retrieval
    GetCustomersParams, GetCustomersResponse, GetCustomers,
    GetProductsParams, GetProductsResponse, GetProducts,
    GetCategoriesParams, GetCategoriesResponse, GetCategories,
    GetProductVariantsParams, GetProductVariantsResponse, GetProductVariants,
    GetOrdersParams, GetOrdersResponse, GetOrders,
    GetContext, GetContextResponse,
    GetFinalContext, GetFinalContextResponse,
    GetCurrentCart, GetCurrentCartResponse,
    // Product Actions
    AddProductDiscountParams, AddProductDiscountResponse, AddProductDiscount,
    AddProductToCartParams, AddProductToCartResponse, AddProductToCart,
    AddProductNoteParams, AddProductNoteResponse, AddProductNote,
    AddProductFeeParams, AddProductFeeResponse, AddProductFee,
    AdjustInventoryParams, AdjustInventoryResponse, AdjustInventory,
    // Order Actions
    AddCustomSaleParams, AddCustomSaleResponse, AddCustomSale,
    AddCartDiscountParams, AddCartDiscountResponse, AddCartDiscount,
    AddOrderNoteParams, AddOrderNoteResponse, AddOrderNote,
    AddCartFeeParams, AddCartFeeResponse, AddCartFee,
    ClearCartResponse, ClearCart,
    ParkOrderResponse, ParkOrder,
    ResumeParkedOrderParams, ResumeParkedOrderResponse, ResumeParkedOrder,
    DeleteParkedOrderParams, DeleteParkedOrderResponse, DeleteParkedOrder,
    InitiateRefundParams, InitiateRefundResponse, InitiateRefund,
    CashPaymentParams, CashPaymentResponse, CashPayment,
    TapToPayPaymentParams, TapToPayPaymentResponse, TapToPayPayment,
    TerminalPaymentParams, TerminalPaymentResponse, TerminalPayment,
    VendaraPaymentParams, VendaraPaymentResponse, VendaraPayment,
    PartialPaymentParams, PartialPaymentResponse, PartialPayment,
    // Customer Actions
    AddCustomerParams, AddCustomerResponse, AddCustomer,
    AssignCustomerParams, AssignCustomerResponse, AssignCustomer,
    AddCustomerNoteParams, AddCustomerNoteResponse, AddCustomerNote,
    RemoveCustomerFromCartResponse, RemoveCustomerFromCart,
    // System Actions
    GoToStationHomeResponse, GoToStationHome,
    OpenCashDrawerResponse, OpenCashDrawer,
    ShowNotificationParams, ShowNotificationResponse, ShowNotification,
    ShowConfirmationParams, ShowConfirmationResponse, ShowConfirmation,
    AuthenticateUserParams, AuthenticateUserResponse, AuthenticateUser,
    UpdateCustomerFacingDisplayParams, UpdateCustomerFacingDisplayResponse, UpdateCustomerFacingDisplay,
    SwitchUserParams, SwitchUserResponse, SwitchUser,
    // Refund Actions
    GetLineItemsByOrderParams, GetLineItemsByOrderResponse, GetLineItemsByOrder,
    SelectAllRefundItemsParams, SelectAllRefundItemsResponse, SelectAllRefundItems,
    ResetRefundDetailsResponse, ResetRefundDetails,
    SetRefundStockActionParams, SetRefundStockActionResponse, SetRefundStockAction,
    CalculateRefundTotalResponse, CalculateRefundTotal,
    ProcessPartialRefundParams, ProcessPartialRefundResponse, ProcessPartialRefund,
    GetRemainingRefundableQuantitiesParams, GetRemainingRefundableQuantitiesResponse, GetRemainingRefundableQuantities,
    // Integration Actions
    TriggerWebhookParams, TriggerWebhookResponse, TriggerWebhook,
    TriggerZapierWebhookParams, TriggerZapierWebhookResponse, TriggerZapierWebhook,
    // Reference
    ExampleFunctionParams, ExampleFunctionResponse, ExampleFunction,
    // Common Types (Directly exported)
    CFProduct, CFProductVariant, CFProductType,
    CFCustomer, CFActiveCustomer, CFCustomerNote,
    CFOrder, CFActiveOrder, CFActiveCart,
    CFActiveProduct, CFActiveCustomSales,
    CFLineItem, CFCustomSale,
    CFDiscount, CFCustomFee, CFTax,
    CFAddress, CFMetadataItem,
    CFActiveUser, CFActiveOutlet, CFActiveStation,
    CFContext
} from '@final-commerce/command-frame';
```

**Note:** The library exports useful types like `CFProduct`, `CFActiveCart`, `CFCustomer`, etc., we recommend using them in your code to type args for components displaying Products/ Customers / Variations / Orders etc

## License

MIT

See [LICENSE](LICENSE) file for details.
