# getCurrentCompanyCustomExtensions

Returns all custom extensions associated with the current company from the local database.

## Parameters

### `GetCurrentCompanyCustomExtensionsParams`

```typescript
interface GetCurrentCompanyCustomExtensionsParams {
    
}
```

No parameters required. The company context is automatically determined from the current session.

## Response

### `GetCurrentCompanyCustomExtensionsResponse`

```typescript
interface GetCurrentCompanyCustomExtensionsResponse {
    success: boolean;
    customExtensions: CustomExtension[];
    timestamp: string;
}
```

#### `success` (boolean)

Indicates whether the operation completed successfully.

#### `customExtensions` (CustomExtension[])

Array of custom extension objects for the current company:

```typescript
type CustomExtension = BaseEntity & {
    _id: string;
    label: string;
    description?: string;
    backgroundUrl?: string;
    gallery?: string[];
    category: string;
    short_description?: string;
    long_description?: string;
    main_image?: string;
    price: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    website?: string;
}
```

#### `timestamp` (string)

ISO 8601 timestamp when the response was generated.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const result = await command.getCurrentCompanyCustomExtensions({});

console.log('Custom Extensions:', result.customExtensions);
```

## Example Response

```json
{
  "success": true,
  "customExtensions": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "label": "Loyalty Program Extension",
      "description": "Add a loyalty points system to your POS",
      "category": "Customer Management",
      "short_description": "Loyalty points tracking",
      "main_image": "https://example.com/images/loyalty-extension.png",
      "price": "$29.99",
      "isDeleted": false,
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-10T14:30:00.000Z",
      "__v": 0
    }
  ],
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

## Notes

- Returns only extensions for the current company (filtered by `companyId`)
- Data is retrieved from the local IndexedDB database
- Extensions with `isDeleted: true` are included in results
- Each company only sees their own custom extensions due to multi-tenancy filtering

