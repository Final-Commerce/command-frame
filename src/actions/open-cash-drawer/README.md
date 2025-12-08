# openCashDrawer

Opens the cash drawer (if connected to a compatible device).

## Parameters

None

## Response

```typescript
{
  success: boolean;
  timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Open the cash drawer
await command.openCashDrawer();
```

## Notes

- Only works if a cash drawer is connected and configured
- May not work in web environments without native device support

## Error Handling

None (always succeeds, but may not have effect if no drawer is connected)

