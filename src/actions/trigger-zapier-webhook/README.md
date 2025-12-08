# triggerZapierWebhook

Triggers a Zapier webhook with the current context data.

## Parameters

- `triggerUrl` (string, required): The Zapier trigger URL

## Response

```typescript
{
  success: boolean;
  triggerUrl: string;
  timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Trigger a Zapier webhook
await command.triggerZapierWebhook({
  triggerUrl: 'https://hooks.zapier.com/hooks/catch/123456/abcdef'
});
```

## Notes

- Sends the current context data (cart, customer, order, etc.) to the Zapier webhook
- The webhook is triggered through the parent application's Zapier integration

## Error Handling

- Throws an error if triggerUrl is missing
- Throws an error if the webhook request fails

