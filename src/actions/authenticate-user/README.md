# authenticateUser

Triggers user authentication for specific roles.

## Parameters

- `roleIds` (string[], required): Array of role IDs that are allowed to authenticate

## Response

```typescript
{
  success: boolean;
  roleIds: string[];
  timestamp: string;
}
```

## Usage

```typescript
import { commands } from '@final-commerce/command-frame';

// Authenticate user with specific roles
await commands.authenticateUser({
  roleIds: ['role-123', 'role-456']
});
```

## Notes

- Shows an authentication dialog in the parent application
- The user must authenticate with one of the specified roles
- Note: The actual promise resolution (success/failure) is handled by the parent application's handler system

## Error Handling

- Throws an error if roleIds is missing or empty

