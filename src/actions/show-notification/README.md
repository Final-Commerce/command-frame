# showNotification

Shows a notification message to the user.

## Parameters

- `message` (string, required): The notification message to display

## Response

```typescript
{
  success: boolean;
  message: string;
  timestamp: string;
}
```

## Usage

```typescript
import { commands } from '@final-commerce/command-frame';

// Show a notification
await commands.showNotification({
  message: 'Order completed successfully!'
});
```

## Error Handling

- Throws an error if message is missing

