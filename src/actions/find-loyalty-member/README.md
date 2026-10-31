# findLoyaltyMember

**Staff mode only.** Finds a card by its number (typed, or scanned off the card's barcode), a phone
or an email, and makes it the member on this sale.

A card found while the cart has a customer, and that isn't linked to anyone yet, is **not** linked on
its own: a wrong scan or a friend's card would stay on that customer for good. The answer says
`canLink: true`; ask the cashier ("Link this card to Giuseppe Verdi?") and, on yes, find it again
with `link: true`. From then on that customer's sales earn on the card.

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
  link?: boolean; // link the card to the sale's customer: only after the cashier said yes
}
```

## Response

```typescript
interface FindLoyaltyMemberResponse {
  success: boolean;
  reason?: string;
  refusal?: CFLoyaltyRefusal;
  member?: CFLoyaltyMember | null; // null: nobody has that card, number or email
  canJoin?: boolean;
  canLink?: boolean; // unlinked card, customer on the sale: ask, then call again with link: true
  timestamp: string;
}
```

## Example

```typescript
const found = await renderClient.findLoyaltyMember({ cardNumber: scanned });
if (!found.success) return toast(found.reason);
if (found.canLink && (await confirm(`Link this card to ${customer.name}?`)))
  await renderClient.findLoyaltyMember({ cardNumber: scanned, link: true });
if (!found.member && found.canJoin) offerToJoin();
```
