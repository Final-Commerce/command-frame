# goToPage

Navigates to a specific page in the application.

## Parameters

- `pageId` (string, required): The ID of the page to navigate to

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
import { command } from '@final-commerce/command-frame';

// Navigate to a specific page
await command.goToPage({
  pageId: 'page-123'
});
```

## Error Handling

- Throws an error if pageId is missing

