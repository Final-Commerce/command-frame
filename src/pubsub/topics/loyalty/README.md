# Loyalty topic

The loyalty side of the open sale (Engage). Re-read [`getLoyalty`](../../../actions/get-loyalty/README.md)
when an event fires instead of polling.

| Event            | When                                                                                                                                                                    | Payload                                                                            |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `member-changed` | The member on this sale changed: the cart's customer was looked up, a card was found, a code proved one, someone joined, the balance moved, or the member left the sale | `{ member: CFLoyaltyMember \| null, canJoin }`                                     |
| `reward-applied` | A reward, an offer or a coupon code went on the cart, with its discount                                                                                                 | `{ applied: CFLoyaltyApplied }`                                                    |
| `reward-removed` | A reward or an offer came off the cart and its stamps or points went back                                                                                               | `{ redemptionId, why: 'removed' \| 'cart-changed' \| 'member-left' \| 'cleared' }` |

```typescript
topics.subscribe('loyalty', async () => {
  const { loyalty } = await renderClient.getLoyalty();
  render(loyalty);
});
```
