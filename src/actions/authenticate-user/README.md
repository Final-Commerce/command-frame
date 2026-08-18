# authenticateUser

Authenticates a user against one of a set of authorized roles, for gating a
privileged action. Supports two modes:

- **Modal (default):** kaching opens its built-in PIN modal; the cashier enters
  a PIN and the command resolves once verification completes.
- **Headless:** the flow supplies a `userId` + `pin` and kaching validates them
  in-process and returns success/failure **without showing any UI** — use this
  when your flow renders its own PIN entry.

In both modes the authenticating user must hold one of the requested `roleIds`.

## Parameters

- `roleIds` (string[], required): Role IDs authorized for the action. The user must hold one of these.
- `userId` (string, optional): Headless mode — the id of the user whose PIN to verify. Must be paired with `pin`.
- `pin` (string, optional): Headless mode — the PIN to check against `userId`'s stored pincode. Must be paired with `userId`.

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

// Modal mode — kaching shows its PIN modal
await command.authenticateUser({
  roleIds: ['role-123', 'role-456']
});

// Headless mode — flow owns the PIN UI, no modal shown
await command.authenticateUser({
  roleIds: ['role-123', 'role-456'],
  userId: 'user-789',
  pin: '4242'
});
```

## Behavior

- The command runs inside kaching (no external "parent app"): it validates the
  roles, then either opens kaching's own PIN modal (modal mode) or validates the
  supplied credentials directly (headless mode), and resolves the promise itself.
- **Headless validation gates**, identical to the modal's PIN pad: the `pin`
  must match the user's stored pincode **and** the user's role must be one of
  `roleIds`. Owners / org users carry no role and therefore cannot pass a
  role-gated authenticate (same as the modal).

> **Security note (headless mode):** validating a `userId` + `pin` in-process has
> no human-in-the-loop brake, so a caller can attempt PIN guesses in a loop.
> There is no built-in rate limiting — restrict which flows may call this command,
> and treat the headless path as trusted-caller only.

## Error Handling

- `Role IDs are required` — `roleIds` is missing or empty.
- `Invalid role ID(s)` — none of the provided role IDs resolve to existing roles.
- `userId and pin must be provided together` — only one of `userId` / `pin` was supplied (headless mode needs both).
- `Authentication failed` — the PIN did not match, the user does not hold one of `roleIds`, or (modal mode) the cashier cancelled or failed verification.
