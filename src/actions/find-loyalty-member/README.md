# findLoyaltyMember

**Staff mode only.** Finds a card by its number (typed, or scanned off the card's barcode), a phone
or an email, and makes it the member on this sale. When the cart has a customer the card isn't
linked to yet, the host links them, so that customer's sales earn on it from now on.

The customer attached to the cart needs no call: the host looks them up when they're assigned and
publishes `loyalty`/`member-changed`.

In customer mode it is refused with `refusal: 'check_needed'`: use
[`startLoyaltyCheck`](../start-loyalty-check/README.md) instead.

## Parameters

```typescript
interface FindLoyaltyMemberParams {
  cardNumber?: string; // the nine digits on the card
  phone?: string;
  email?: string;
}
```

## Response

```typescript
interface FindLoyaltyMemberResponse {
  success: boolean;
  reason?: string;
  refusal?: CFLoyaltyRefusal;
  member: CFLoyaltyMember | null; // null: nobody has that card, number or email
  canJoin: boolean;
  timestamp: string;
}
```

## Example

```typescript
const found = await renderClient.findLoyaltyMember({ cardNumber: scanned });
if (!found.success) return toast(found.reason);
if (!found.member && found.canJoin) offerToJoin();
```
