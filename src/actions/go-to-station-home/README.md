# goToStationHome

Navigates to the station home page.

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
import { commands } from '@final-commerce/command-frame';

// Navigate to station home
await commands.goToStationHome();
```

## Error Handling

None (always succeeds)

