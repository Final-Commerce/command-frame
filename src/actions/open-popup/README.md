# openPopup

Opens a popup/modal by ID.

## Parameters

- `popupId` (string, required): The ID of the popup to open

## Response

```typescript
{
  success: boolean;
  popupId: string;
  timestamp: string;
}
```

## Usage

```typescript
import { commands } from '@final-commerce/command-frame';

// Open a popup
await commands.openPopup({
  popupId: 'popup-123'
});
```

## Notes

- If the popup is already open, calling this will close it (toggle behavior)

## Error Handling

- Throws an error if popupId is missing

