# toggleSlideOut

Toggles (opens/closes) a slide-out panel by ID.

## Parameters

- `slideOutId` (string, required): The ID of the slide-out to toggle

## Response

```typescript
{
  success: boolean;
  slideOutId: string;
  timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Toggle a slide-out
await command.toggleSlideOut({
  slideOutId: 'slideout-123'
});
```

## Notes

- If the slide-out is open, calling this will close it, and vice versa

## Error Handling

- Throws an error if slideOutId is missing

