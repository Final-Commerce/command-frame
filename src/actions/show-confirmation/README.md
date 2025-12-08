# showConfirmation

Shows a confirmation dialog to the user.

## Parameters

- `message` (string, required): The confirmation message to display

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

// Show a confirmation dialog
await commands.showConfirmation({
  message: 'Are you sure you want to proceed?'
});
```

## Notes

- Shows a confirmation dialog in the parent application
- The user can accept or decline the confirmation
- Note: The actual promise resolution (accept/decline) is handled by the parent application's handler system

## Error Handling

- Throws an error if message is missing

