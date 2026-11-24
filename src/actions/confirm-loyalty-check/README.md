# confirmLoyaltyCheck

The code the customer typed back. Right: the card it proved becomes the member on this sale for the
rest of it (half an hour at most), and their rewards and offers can go on the cart. Five wrong codes
use the check up; ask for a new one.

## Parameters

```typescript
interface ConfirmLoyaltyCheckParams {
  code: string; // the 6 digits
}
```

## Response

```typescript
interface ConfirmLoyaltyCheckResponse {
  success: boolean;
  reason?: string;
  refusal?: CFLoyaltyRefusal; // wrong_code, expired, used_up, not_found
  member: CFLoyaltyMember | null; // null: they proved a phone or email that isn't a member's yet
  canJoin: boolean;
  timestamp: string;
}
```

## Example

```typescript
const done = await renderClient.confirmLoyaltyCheck({ code });
if (!done.success) return showError(done.reason); // "That code isn't right. 4 more tries."
if (done.member) showCard(done.member);
else if (done.canJoin) offerToJoin();
```
