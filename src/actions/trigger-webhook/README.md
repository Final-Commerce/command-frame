# triggerWebhook

Triggers a webhook with the specified configuration.

## Parameters

- `webhookUrl` (string, required): The URL of the webhook to trigger
- `publicKey` (string, optional): Public key for authentication
- `presetData` (boolean, optional): Whether to use preset data (default: false)
- `presetType` (string, optional): Type of preset data to use
- `isCustomHook` (boolean, optional): Whether this is a custom webhook (default: false)
- `customHookData` (string, optional): Custom hook data
- `payloadType` (string, optional): Payload type ('json' or 'form-urlencoded', default: 'json')
- `dynamicDataFields` (any[], optional): Dynamic data fields for the webhook

## Response

```typescript
{
  success: boolean;
  webhookUrl: string;
  timestamp: string;
}
```

## Usage

```typescript
import { commands } from '@final-commerce/command-frame';

// Trigger a simple webhook
await commands.triggerWebhook({
  webhookUrl: 'https://example.com/webhook'
});

// Trigger a webhook with custom data
await commands.triggerWebhook({
  webhookUrl: 'https://example.com/webhook',
  payloadType: 'json',
  presetData: true,
  presetType: 'order'
});
```

## Error Handling

- Throws an error if webhookUrl is missing
- Throws an error if the webhook request fails

