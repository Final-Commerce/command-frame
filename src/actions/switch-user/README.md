# switchUser

Switches the current user to a different user.

## Parameters

- `mode` ('dialog' | 'role' | 'specific', required): The switch mode
  - `'dialog'`: Shows a dialog to select from all users
  - `'role'`: Shows users with specific roles (requires `roleIds`)
  - `'specific'`: Switches to a specific user (requires `userId`)
- `roleIds` (string[], optional): Array of role IDs (required for 'role' mode)
- `userId` (string, optional): The user ID to switch to (required for 'specific' mode)

## Response

```typescript
{
  success: boolean;
  mode: 'dialog' | 'role' | 'specific';
  roleIds?: string[];
  userId?: string;
  timestamp: string;
}
```

## Usage

```typescript
import { commands } from '@final-commerce/command-frame';

// Show dialog to select user
await commands.switchUser({
  mode: 'dialog'
});

// Switch to user with specific roles
await commands.switchUser({
  mode: 'role',
  roleIds: ['role-123', 'role-456']
});

// Switch to specific user
await commands.switchUser({
  mode: 'specific',
  userId: 'user-123'
});
```

## Error Handling

- Throws an error if mode is missing
- Throws an error if roleIds is missing for 'role' mode
- Throws an error if userId is missing for 'specific' mode
- Throws an error if the switch operation fails

