# applyLoyaltyReward

Puts a reward, an offer on the member's card, or a coupon code on the cart, in ONE call: the host
holds it at Engage (a reward's stamps or points come off now) and adds its discount to the cart
itself, under the reward's name ("A drink on us"), and names the hold in the order's metadata
(`engage.loyalty.<redemptionId>`): that is how Engage redeems it when the sale is saved, so a flow
leaves those metadata keys alone. A flow never writes a loyalty discount with `addCartDiscount` or
`addProductDiscount`.

Anything the host can't put on a cart (a reward with no amount, a percentage outside 1 to 100) is
refused with `unavailable` and its stamps go straight back.

| Kind                                      | Where it goes                                                                                    |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `amount_off`, `percent_off` on everything | The cart's discount                                                                              |
| `percent_off` on some products            | A discount on each matching line                                                                 |
| `free_item`                               | A discount on the cheapest matching line with one unit; on a line with more, the cart's discount |

The cart has **one** cart-discount slot. When it holds another discount, a cart-wide reward is
refused (`cart_discount_taken`) rather than overwriting it: say so and let the cashier choose.

The hold lasts 20 minutes. The host gives it back when the discount comes off the cart, the member
leaves the sale or the cart is cleared, and settles it with the order when the sale is paid.

## Parameters

```typescript
interface ApplyLoyaltyRewardParams {
  rewardId?: string; // a reward of the member on this sale
  grantId?: string; // a coupon on their card (`member.offers`), or waiting on the customer on the sale (`loyalty.offers`)
  code?: string; // a coupon code; needs no member
}
```

## Response

```typescript
interface ApplyLoyaltyRewardResponse {
  success: boolean;
  reason?: string;
  refusal?: CFLoyaltyRefusal; // unavailable, check_needed, cart_discount_taken, nothing_to_discount, not_found, offline
  applied?: CFLoyaltyApplied; // redemptionId, label, where it went, expiresAt
  timestamp: string;
}
```

## Example

```typescript
const { loyalty } = await renderClient.getLoyalty();
const ready = loyalty.member?.rewards.find((r) => r.available);
if (ready) {
  const used = await renderClient.applyLoyaltyReward({ rewardId: ready.id });
  if (!used.success) toast(used.reason);
}
```
