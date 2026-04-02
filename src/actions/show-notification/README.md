# showNotification

Shows a notification message to the user.

## Parameters

### `ShowNotificationParams`

```typescript
interface ShowNotificationParams {
  message: string;
  type?: "success" | "error" | "info" | "warning";
}
```

- `message` (string, required): The notification text.
- `type` (optional): Hint for the host (e.g. toast style). Hosts that ignore it still show the message.

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
import { command } from '@final-commerce/command-frame';

await command.showNotification({
  message: 'Order completed successfully!',
  type: 'success',
});
```

## Error Handling

- Hosts may return `success: false` when `message` is empty or invalid.
