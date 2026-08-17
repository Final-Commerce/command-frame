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
import { command } from '@final-commerce/command-frame';

// Authenticate user with specific roles
await command.authenticateUser({
  roleIds: ['role-123', 'role-456']
});
```

## Notes

- Shows an authentication dialog in the parent application
- The user must authenticate with one of the specified roles
- Note: The actual promise resolution (success/failure) is handled by the parent application's handler system

## Error Handling

- Throws an error (`Role IDs are required`) if `roleIds` is missing or empty
- Throws an error (`Invalid role ID(s)`) if none of the provided role IDs resolve to existing roles
- Throws an error (`Authentication failed`) if the user does not successfully authenticate (e.g. cancels or fails verification)

