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
import { command } from '@final-commerce/command-frame';

// Navigate to station home
await command.goToStationHome();
```

## Error Handling

None (always succeeds)

