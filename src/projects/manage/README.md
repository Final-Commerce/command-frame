# Manage Integration

Client and Provider implementation for the Manage Dashboard environment.

## Usage

```typescript
import { manageClient } from "@final-commerce/command-frame";

const context = await manageClient.getContext();
console.log("Company:", context.company.name);
```

## API Reference

### Context & Configuration

#### [getContext](../../actions/get-context/README.md)
Retrieve current user and environment context (company, user, extension, menu item, outlet).

#### [getFinalContext](../../actions/get-final-context/README.md)
Retrieve project identification.

#### [generateAPIKey](../../actions/generate-api-key/README.md)
Generate an API key for the current company.

### Company Data

#### [getUsers](../../actions/get-users/README.md)
Retrieve a list of users for the current company.

#### [getRoles](../../actions/get-roles/README.md)
Retrieve a list of roles for the current company.

#### [getCustomers](../../actions/get-customers/README.md)
Retrieve a paginated list of customers for the current company. Supports search and pagination.

### Catalog

#### [getProducts](../../actions/get-products/README.md)
Retrieve a paginated list of products (with embedded variants). Supports filtering by status, category, and search.

#### [getCategories](../../actions/get-categories/README.md)
Retrieve a list of categories.

#### [editProduct](../../actions/edit-product/README.md)
Update a product's fields (name, price, images, etc.).

#### [editProductVariants](../../actions/edit-product-variants/README.md)
Update one or more variants of a product.

#### [deleteProduct](../../actions/delete-product/README.md)
Soft-delete a product.

### Entities

#### [getOutlets](../../actions/get-outlets/README.md)
Retrieve a list of outlets for the current company.

#### [getStations](../../actions/get-stations/README.md)
Retrieve a list of stations for a specific outlet.

#### [getOrders](../../actions/get-orders/README.md)
Retrieve a paginated list of orders. Supports filtering by status, search, and pagination.

### Custom Tables

#### [getCustomTables](../../actions/get-custom-tables/README.md)
Retrieve all custom tables accessible to the current company.

#### [getCustomTableData](../../actions/get-custom-table-data/README.md)
Retrieve data (documents) from a specific custom table with pagination.

#### [upsertCustomTableData](../../actions/upsert-custom-table-data/README.md)
Insert or update a document in a custom table.

#### [deleteCustomTableData](../../actions/delete-custom-table-data/README.md)
Delete a document from a custom table.

### Custom Extensions

#### [getCustomExtensions](../../actions/get-custom-extensions/README.md)
Retrieve all custom extensions.

#### [getCurrentCompanyCustomExtensions](../../actions/get-current-company-custom-extensions/README.md)
Retrieve custom extensions installed by the current company.

#### [getCustomExtensionCustomTables](../../actions/get-custom-extension-custom-tables/README.md)
Retrieve custom tables associated with a specific extension.

### Secrets Storage

#### [getSecretsKeys](../../actions/get-secrets-keys/README.md)
Retrieve the list of secret keys (company-level or extension-scoped).

#### [getSecretVal](../../actions/get-secret-val/README.md)
Retrieve a secret value by key.

#### [setSecretVal](../../actions/set-secret-val/README.md)
Create or update a secret value.
