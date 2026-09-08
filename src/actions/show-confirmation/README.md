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

- `success`: `true` if the user confirmed, `false` if the user declined. It reflects the user's choice, not whether the dialog itself succeeded — there is no separate `confirmed` field.
- `message`: echoes back the message that was shown.
- `timestamp`: ISO timestamp of when the response was generated.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Show a confirmation dialog
await command.showConfirmation({
  message: 'Are you sure you want to proceed?',
});
```

## Notes

- Shows a confirmation dialog in the parent application
- The user can accept or decline the confirmation
- Declining resolves the promise with `success: false` — it does not reject. Only a missing `message` param causes a rejection.
- Note: The actual promise resolution (accept/decline) is handled by the parent application's handler system

## Error Handling

- Throws `Error('Message is required')` if `message` is missing or empty
