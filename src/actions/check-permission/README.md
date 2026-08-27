# checkPermission

Read-only query: does the **active user** hold a named permission?

Truth source is the runtime's hydrated active user — role and permissions come from the synced `users`/`roles` collections. Role-less user types (company owner, final/org staff) are always `allowed: true`, mirroring the runtime's own gating semantics.

## Parameters

`params: CheckPermissionParams`

| Parameter    | Type     | Required | Description                                  |
| ------------ | -------- | -------- | -------------------------------------------- |
| `permission` | `string` | Yes      | Permission name, e.g. `'issue_refunds'`.     |

## Response

`Promise<CheckPermissionResponse>`

| Field        | Type      | Description                                                       |
| ------------ | --------- | ----------------------------------------------------------------- |
| `success`    | `boolean` | Whether the query succeeded.                                      |
| `permission` | `string`  | Echo of the permission checked.                                   |
| `allowed`    | `boolean` | True when the active user holds the permission (or their user type bypasses roles). |
| `timestamp`  | `string`  | ISO timestamp.                                                    |

## Known permissions

| Permission       | Gates                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| `issue_refunds`  | `processPartialRefund`, `redeemRefund` — enforced runtime-side with a `REFUND_PERMISSION_DENIED: `-prefixed throw. |

## Example — pre-gating a refund dialog

```typescript
import { command } from '@final-commerce/command-frame';

const { allowed } = await command.checkPermission({ permission: 'issue_refunds' });
if (!allowed) {
  showBanner('You are not allowed to initiate refunds');
  disableRefundButton();
}
```

**This is UI pre-gating, not the security boundary.** The mutating refund commands enforce `issue_refunds` runtime-side regardless of what your UI shows — always handle a `REFUND_PERMISSION_DENIED: `-prefixed rejection from `processPartialRefund` / `redeemRefund` (prefix-match, like `REFUND_AMOUNT_EXCEEDS_CAPACITY:`).

## Error Handling

- **Missing `permission`**: throws `checkPermission: permission is required` (kaching `handler.ts`). The mock throws `permission is required` (no prefix) — match the runtime string above, not the mock's.

## Mock divergence

The standalone mock returns `allowed: true` for every permission except the magic name `'mock_denied'` (returns `allowed: false`), so both UI branches are testable outside the iframe. Real role evaluation happens only in the runtime.
