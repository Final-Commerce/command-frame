# goToStationHome

Navigates to the station home page. In hosted (ServiceChannel) mode this delegates to the shell via a host-navigate request; in standalone mode it triggers native navigation directly through the device bridge.

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

Hosted (ServiceChannel) mode: none — navigation is delegated to the host and this call always resolves successfully.

Standalone mode: throws `CommandFrameBridge not initialized. Ensure CommandFrameListener is mounted.` if the bridge hasn't been set up yet.
