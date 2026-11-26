# getLoyalty

Everything a loyalty screen needs about **this sale**: the company's programme, the member on the
sale, whether the customer on it can join, who is in front of the screen, and the rewards already
on the cart. Start every loyalty screen here, and again whenever the `loyalty` topic says something
changed.

Engage keeps the programme, every balance and every coupon. The host asks Hub with the sign-in it
already holds, Hub asks Engage, and the host puts what Engage answers on the cart itself, so a flow
never handles a token, a key, a hold's id or a customer's email or phone. With no programme running, `program` is null;
with no coupons on either (`coupons` false), hide the loyalty button.

## Parameters

```typescript
interface GetLoyaltyParams {
  refresh?: boolean; // ask Engage again instead of answering from what the host knows
}
```

## Response

```typescript
interface GetLoyaltyResponse {
  success: boolean;
  reason?: string; // a refusal in words for the person (offline, …)
  refusal?: CFLoyaltyRefusal; // which one, to branch on
  loyalty: CFLoyaltyState; // always present; offline it is what the host last knew
  timestamp: string;
}

interface CFLoyaltyState {
  program: CFLoyaltyProgram | null;
  coupons?: boolean; // coupons are on: the customer on the sale is looked up for theirs, programme or not
  member: CFLoyaltyMember | null; // name, number, balance, headline, next, rewards (with `available`), offers
  offers?: CFLoyaltyOffer[]; // coupons waiting on the sale's customer when they have no card
  canJoin: boolean;
  mode: 'staff' | 'customer';
  checkPending: boolean; // customer mode: a code is waiting to be typed back
  applied: CFLoyaltyApplied[];
}
```

## Example

```typescript
const { loyalty } = await renderClient.getLoyalty();
if (!loyalty.program && !loyalty.coupons) return null; // neither: no button

if (loyalty.member) {
  showCard(loyalty.member.headline, loyalty.member.next);
  loyalty.member.rewards.filter((r) => r.available).forEach(showUseButton);
}
// Coupons waiting on them: on their card, or on them as a customer when they have none.
[...(loyalty.member?.offers ?? []), ...(loyalty.offers ?? [])].forEach(showCouponButton); // applyLoyaltyReward({ grantId })
```

## Who is in front of the screen

`mode` is decided on the server, never by the host or the flow:

- **`staff`** — a staffed till. The customer attached to the cart is looked up on their own
  (`cart`/`customer-assigned`), and [`findLoyaltyMember`](../find-loyalty-member/README.md) finds a
  card by its number, a phone or an email.
- **`customer`** — a website, or a station the shop marked in Engage (Promote → Loyalty → Till) as
  one customers use themselves (a kiosk, a self-checkout). Nobody's card shows until a code sent to its phone or email came back:
  [`startLoyaltyCheck`](../start-loyalty-check/README.md), then
  [`confirmLoyaltyCheck`](../confirm-loyalty-check/README.md). A card number is printed on the card
  and a phone number is no secret, so typing one proves nothing.

## Notes

- A coupon with a minimum spend (`discount.minSpendMinor`) goes on only once the sale reaches it
  (what the customer spends, not a gift card loaded on the sale), and comes off again if the cart
  drops under it. A customer's coupons and rewards come off the cart when they leave the sale or the
  cashier puts someone else on it.
- Earning and redeeming need no command: Engage earns from the saved sale and redeems the rewards on
  it on its own. A refund takes back what the sale earned and gives back the rewards used on it.
  Don't keep balances, stamps or points in custom tables.
- Never block a sale on loyalty: offline or refused, carry on and say so.
