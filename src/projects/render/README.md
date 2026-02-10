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
- **[getOrders](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-orders/README.md)** - Retrieve a list of orders from the system with optional filtering, sorting, and pagination
- **[getCurrentCart](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-current-cart/README.md)** - Retrieve the current cart object with all its contents
- **[getContext](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-context/README.md)** - Get current environment/context information (user, company, device, station, outlet, build)
- **[getFinalContext](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-final-context/README.md)** - Get final context information (project name)

#### Product Actions

- **[addProductToCart](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/add-product-to-cart/README.md)** - Add a product to the cart with optional discounts, fees, and notes
- **[removeProductFromCart](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/remove-product-from-cart/README.md)** - Remove a product from the cart (using `internalId`)
- **[updateCartItemQuantity](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/update-cart-item-quantity/README.md)** - Update the quantity of a cart item (using `internalId`)
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
- **[print](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/print/README.md)** - Print content to a connected printer or open browser print dialog (supports images, HTML, selectors, and receipts)
- **[showNotification](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/show-notification/README.md)** - Show a notification message
- **[showConfirmation](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/show-confirmation/README.md)** - Show a confirmation dialog
- **[authenticateUser](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/authenticate-user/README.md)** - Trigger user authentication for specific roles
- **[switchUser](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/switch-user/README.md)** - Switch the current user to a different user

#### Refund Actions

- **[initiateRefund](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/initiate-refund/README.md)** - Open the refund UI for an order
- **[selectAllRefundItems](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/select-all-refund-items/README.md)** - Select all remaining refundable items for a full refund
- **[resetRefundDetails](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/reset-refund-details/README.md)** - Clear all refund selections
- **[setRefundStockAction](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/set-refund-stock-action/README.md)** - Set stock handling option (restock/damage) for a refunded item
- **[calculateRefundTotal](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/calculate-refund-total/README.md)** - Calculate refund total based on current selections
- **[processPartialRefund](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/process-partial-refund/README.md)** - Process a partial refund based on current selections
- **[getRemainingRefundableQuantities](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-remaining-refundable-quantities/README.md)** - Get remaining refundable quantities for items in the active order

#### Custom Tables & Extensions

- **[getCustomTables](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-custom-tables/README.md)** - Retrieve all custom tables from the local database
- **[getCustomTableData](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-custom-table-data/README.md)** - Retrieve data from a specific custom table with filtering and pagination
- **[getCustomTableFields](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-custom-table-fields/README.md)** - Retrieve field definitions (schema) for a specific custom table
- **[upsertCustomTableData](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/upsert-custom-table-data/README.md)** - Insert or update data in a custom table
- **[deleteCustomTableData](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/delete-custom-table-data/README.md)** - Delete a specific record from a custom table
- **[getCustomExtensions](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-custom-extensions/README.md)** - Retrieve all custom extensions from the local database
- **[getCurrentCompanyCustomExtensions](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-current-company-custom-extensions/README.md)** - Retrieve all custom extensions for the current company
- **[getCustomExtensionCustomTables](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-custom-extension-custom-tables/README.md)** - Retrieve custom tables associated with a specific extension

#### Secrets Storage

- **[getSecretsKeys](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-secrets-keys/README.md)** - Retrieve all secret keys for the current company or a specific extension
- **[getSecretVal](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-secret-val/README.md)** - Retrieve the value of a specific secret by key
- **[setSecretVal](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/set-secret-val/README.md)** - Create or update a secret key-value pair

#### Integration Actions

- **[triggerWebhook](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/trigger-webhook/README.md)** - Trigger a webhook with the specified configuration
- **[triggerZapierWebhook](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/trigger-zapier-webhook/README.md)** - Trigger a Zapier webhook with the current context data

#### Reference

- **[exampleFunction](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/example-function/README.md)** - Example/template function (for reference only)

For detailed documentation on each command, including parameter descriptions, response structures, and usage examples, see the [Commands Documentation](#commands-documentation) section below.

## Quick Start

```typescript
import { command } from "@final-commerce/command-frame";

// Get products from parent window
const products = await command.getProducts();

// Get customers from parent window
const customers = await command.getCustomers();

// Get categories from parent window
const categories = await command.getCategories();

// Add product to cart with optional discounts and fees
const addedProduct = await command.addProductToCart({
    variantId: "691df9c6c478bada1fb23d55",
    quantity: 1,
    discounts: [
        {
            amount: 10,
            isPercent: false,
            label: "Discount"
        }
    ],
    notes: "No onions"
});

// Add a discount to the specific item just added (if you didn't add it during creation)
await command.addProductDiscount({
    internalId: addedProduct.internalId,
    amount: 5,
    isPercent: true,
    label: "Extra 5% Off"
});

// Add cart discount
await command.addCartDiscount({
    amount: 10,
    isPercent: false,
    label: "Cart Discount"
});

// Get current context/environment
const context = await command.getContext();
console.log("Current user:", context.userId);
console.log("Current company:", context.companyName);
console.log("Current build:", context.buildName);

// Work with custom tables
const customTables = await command.getCustomTables();
console.log("Available custom tables:", customTables.customTables);

// Insert data into a custom table
await command.upsertCustomTableData({
    tableName: "customer_preferences",
    data: {
        customerId: context.userId,
        theme: "dark",
        notifications: true
    }
});

// Query custom table data
const preferences = await command.getCustomTableData({
    tableName: "customer_preferences",
    query: { customerId: context.userId }
});
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

### [removeProductFromCart](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/remove-product-from-cart/README.md)

Removes a product from the cart by its unique `internalId`. Publishes a `product-deleted` event on the `cart` topic.

### [updateCartItemQuantity](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/update-cart-item-quantity/README.md)

Updates the quantity of a cart item by its unique `internalId`. If quantity is set to 0, the item is removed. Includes stock validation when increasing quantity. Publishes `product-updated` or `product-deleted` events on the `cart` topic.

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

### [switchUser](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/switch-user/README.md)

Switches the current user to a different user. Supports three modes: dialog (select from all users), role (select from users with specific roles), or specific (switch to a specific user).

### [print](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/print/README.md)

Prints content to a connected printer or opens the browser print dialog. Supports multiple print types: images (base64-encoded), HTML content, DOM elements via selectors, and receipts. Publishes events on the `print` topic when print actions are initiated, completed, or encounter errors.

### Refund Actions

### [initiateRefund](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/initiate-refund/README.md)

Opens the refund UI for the specified order or the currently active order.

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

### Custom Tables & Extensions

### [getCustomTables](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-custom-tables/README.md)

Retrieves a list of all custom tables from the parent application's local database. Custom tables allow you to store and manage custom data structures specific to your business needs.

### [getCustomTableData](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-custom-table-data/README.md)

Retrieves data from a specific custom table. Supports MongoDB-style filtering, pagination with offset and limit parameters, and type-safe generic responses.

### [getCustomTableFields](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-custom-table-fields/README.md)

Retrieves the field definitions (schema) for a specific custom table. Returns field metadata including name, type (string, number, boolean, date, json-string), required status, default values, and reference relationships.

### [upsertCustomTableData](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/upsert-custom-table-data/README.md)

Inserts new data or updates existing data in a custom table. If the data includes an `_id` field, it updates the existing record; otherwise, it creates a new one. Supports type-safe generic operations.

### [deleteCustomTableData](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/delete-custom-table-data/README.md)

Deletes a specific record from a custom table by its unique `_id`. The deletion is permanent and synchronized with the central database.

### [getCustomExtensions](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-custom-extensions/README.md)

Retrieves all custom extensions from the local database. Extensions are additional features or modules that can be installed in the Final Commerce ecosystem, each potentially having associated custom tables.

### [getCustomExtensionCustomTables](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-custom-extension-custom-tables/README.md)

Retrieves all custom tables associated with a specific custom extension. Useful for discovering and managing the data structures created by installed extensions.

### Secrets Storage

### [getSecretsKeys](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-secrets-keys/README.md)

Retrieves all secret keys for the current company or a specific extension. Supports both company-level and extension-scoped secrets. Returns an array of key names without their values.

### [getSecretVal](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/get-secret-val/README.md)

Retrieves the value of a specific secret by its key. Supports both company-level and extension-scoped secrets. Returns the key-value pair.

### [setSecretVal](https://github.com/Final-Commerce/command-frame/blob/main/src/actions/set-secret-val/README.md)

Creates or updates a secret key-value pair. Supports both company-level and extension-scoped secrets. Automatically handles create vs update (upsert behavior).

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
    - `customer-created` - Published when a new customer is created
    - `customer-updated` - Published when a customer's information is updated
    - `customer-note-added` - Published when a note is added to a customer
    - `customer-note-deleted` - Published when a note is deleted from a customer
    - `customer-assigned` - Published when a customer is assigned to the cart
    - `customer-unassigned` - Published when a customer is unassigned from the cart

#### Order Events

- **[orders](https://github.com/Final-Commerce/command-frame/blob/main/src/pubsub/topics/orders/README.md)** - Order lifecycle events
    - `order-created` - Published when a new order is created
    - `order-updated` - Published when an order is updated

#### Refund Events

- **[refunds](https://github.com/Final-Commerce/command-frame/blob/main/src/pubsub/topics/refunds/README.md)** - Refund lifecycle events
    - `refund-created` - Published when a refund is created
    - `refund-updated` - Published when a refund is updated

#### Product Events

- **[products](https://github.com/Final-Commerce/command-frame/blob/main/src/pubsub/topics/products/README.md)** - Product sync events
    - `product-created` - Published when a product is created
    - `product-updated` - Published when a product is updated

#### Cart Events

- **[cart](https://github.com/Final-Commerce/command-frame/blob/main/src/pubsub/topics/cart/README.md)** - Cart operation events
    - `cart-created` - Published when a cart is created
    - `customer-assigned` - Published when a customer is assigned to the cart
    - `product-added` - Published when a product is added to the cart
    - `product-updated` - Published when a cart item's quantity is updated
    - `product-deleted` - Published when a product is removed from the cart
    - `cart-discount-added` - Published when a discount is added to the cart
    - `cart-discount-removed` - Published when a discount is removed from the cart
    - `cart-fee-added` - Published when a fee is added to the cart
    - `cart-fee-removed` - Published when a fee is removed from the cart

#### Payment Events

- **[payments](https://github.com/Final-Commerce/command-frame/blob/main/src/pubsub/topics/payments/README.md)** - Payment processing events
    - `payment-done` - Published when a payment is successfully completed
    - `payment-err` - Published when a payment fails

#### Print Events

- **[print](https://github.com/Final-Commerce/command-frame/blob/main/src/pubsub/topics/print/README.md)** - Print action events
    - `print-started` - Published when a print action is initiated
    - `print-completed` - Published when a print action completes successfully
    - `print-error` - Published when a print action encounters an error

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
import { command } from "@final-commerce/command-frame";
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
    GetCustomersParams,
    GetCustomersResponse,
    GetCustomers,
    GetProductsParams,
    GetProductsResponse,
    GetProducts,
    GetCategoriesParams,
    GetCategoriesResponse,
    GetCategories,
    GetOrdersParams,
    GetOrdersResponse,
    GetOrders,
    GetContext,
    GetContextResponse,
    GetFinalContext,
    GetFinalContextResponse,
    GetCurrentCart,
    GetCurrentCartResponse,
    // Product Actions
    AddProductDiscountParams,
    AddProductDiscountResponse,
    AddProductDiscount,
    AddProductToCartParams,
    AddProductToCartResponse,
    AddProductToCart,
    RemoveProductFromCartParams,
    RemoveProductFromCartResponse,
    RemoveProductFromCart,
    UpdateCartItemQuantityParams,
    UpdateCartItemQuantityResponse,
    UpdateCartItemQuantity,
    AddProductNoteParams,
    AddProductNoteResponse,
    AddProductNote,
    AddProductFeeParams,
    AddProductFeeResponse,
    AddProductFee,
    AdjustInventoryParams,
    AdjustInventoryResponse,
    AdjustInventory,
    // Order Actions
    AddCustomSaleParams,
    AddCustomSaleResponse,
    AddCustomSale,
    AddCartDiscountParams,
    AddCartDiscountResponse,
    AddCartDiscount,
    AddOrderNoteParams,
    AddOrderNoteResponse,
    AddOrderNote,
    AddCartFeeParams,
    AddCartFeeResponse,
    AddCartFee,
    ClearCartResponse,
    ClearCart,
    ParkOrderResponse,
    ParkOrder,
    ResumeParkedOrderParams,
    ResumeParkedOrderResponse,
    ResumeParkedOrder,
    DeleteParkedOrderParams,
    DeleteParkedOrderResponse,
    DeleteParkedOrder,
    CashPaymentParams,
    CashPaymentResponse,
    CashPayment,
    TapToPayPaymentParams,
    TapToPayPaymentResponse,
    TapToPayPayment,
    TerminalPaymentParams,
    TerminalPaymentResponse,
    TerminalPayment,
    VendaraPaymentParams,
    VendaraPaymentResponse,
    VendaraPayment,
    PartialPaymentParams,
    PartialPaymentResponse,
    PartialPayment,
    // Customer Actions
    AddCustomerParams,
    AddCustomerResponse,
    AddCustomer,
    AssignCustomerParams,
    AssignCustomerResponse,
    AssignCustomer,
    AddCustomerNoteParams,
    AddCustomerNoteResponse,
    AddCustomerNote,
    RemoveCustomerFromCartResponse,
    RemoveCustomerFromCart,
    // System Actions
    GoToStationHomeResponse,
    GoToStationHome,
    OpenCashDrawerResponse,
    OpenCashDrawer,
    ShowNotificationParams,
    ShowNotificationResponse,
    ShowNotification,
    ShowConfirmationParams,
    ShowConfirmationResponse,
    ShowConfirmation,
    AuthenticateUserParams,
    AuthenticateUserResponse,
    AuthenticateUser,
    SwitchUserParams,
    SwitchUserResponse,
    SwitchUser,
    // Refund Actions
    InitiateRefundParams,
    InitiateRefundResponse,
    InitiateRefund,
    SelectAllRefundItemsParams,
    SelectAllRefundItemsResponse,
    SelectAllRefundItems,
    ResetRefundDetailsResponse,
    ResetRefundDetails,
    SetRefundStockActionParams,
    SetRefundStockActionResponse,
    SetRefundStockAction,
    CalculateRefundTotalResponse,
    CalculateRefundTotal,
    ProcessPartialRefundParams,
    ProcessPartialRefundResponse,
    ProcessPartialRefund,
    GetRemainingRefundableQuantitiesParams,
    GetRemainingRefundableQuantitiesResponse,
    GetRemainingRefundableQuantities,
    // Secrets Storage
    GetSecretsKeysParams,
    GetSecretsKeysResponse,
    GetSecretsKeys,
    GetSecretValParams,
    GetSecretValResponse,
    GetSecretVal,
    SetSecretValParams,
    SetSecretValResponse,
    SetSecretVal,
    // Integration Actions
    TriggerWebhookParams,
    TriggerWebhookResponse,
    TriggerWebhook,
    TriggerZapierWebhookParams,
    TriggerZapierWebhookResponse,
    TriggerZapierWebhook,
    // Reference
    ExampleFunctionParams,
    ExampleFunctionResponse,
    ExampleFunction,
    // Common Types (Directly exported)
    CFProduct,
    CFProductVariant,
    CFProductType,
    CFCustomer,
    CFActiveCustomer,
    CFCustomerNote,
    CFOrder,
    CFActiveOrder,
    CFActiveCart,
    CFActiveProduct,
    CFActiveCustomSales,
    CFLineItem,
    CFCustomSale,
    CFDiscount,
    CFCustomFee,
    CFTax,
    CFAddress,
    CFMetadataItem,
    CFActiveUser,
    CFActiveOutlet,
    CFActiveStation,
    CFContext
} from "@final-commerce/command-frame";
```

**Note:** The library exports useful types like `CFProduct`, `CFActiveCart`, `CFCustomer`, etc., we recommend using them in your code to type args for components displaying Products/ Customers / Variations / Orders etc

## License

MIT

See [LICENSE](LICENSE) file for details.
