# updateCustomerFacingDisplay

Updates the customer-facing display to show a specific page.

## Parameters

- `pageId` (string, required): The ID of the page to display on the customer-facing display

## Response

```typescript
{
  success: boolean;
  pageId: string;
  timestamp: string;
}
```

## Usage

```typescript
import { commands } from '@final-commerce/command-frame';

// Update customer facing display
await commands.updateCustomerFacingDisplay({
  pageId: 'page-123'
});
```

## Error Handling

- Throws an error if pageId is missing

