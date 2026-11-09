# startLoyaltyCheck

Sends a 6-digit code so a customer can prove a card is theirs on a screen they use themselves. The
code goes to the phone or email they typed, or, for a card number, to the phone on the card (else
its email). The answer says how the code went, never where: a card's contact is not shown on a
screen.

Someone who isn't a member yet proves the phone or email they'll join with the same way, and then
[`joinLoyalty`](../join-loyalty/README.md) joins them with it.

## Parameters

```typescript
interface StartLoyaltyCheckParams {
  cardNumber?: string;
  phone?: string;
  email?: string;
}
```

## Response

```typescript
interface StartLoyaltyCheckResponse {
  success: boolean;
  reason?: string;
  refusal?: CFLoyaltyRefusal; // not_member, no_contact, too_many, cannot_send, not_live, offline
  channel?: 'sms' | 'email';
  expiresAt?: string; // the code works for 10 minutes
  timestamp: string;
}
```

## Example

```typescript
const sent = await renderClient.startLoyaltyCheck({ phone });
if (!sent.success) return showError(sent.reason);
showCodeField(sent.channel === 'sms' ? 'We texted you a code' : 'We emailed you a code');
```

## Notes

- Codes are limited: three to one phone or email, and five on one sale, in a quarter of an hour.
  `too_many` is the normal answer to a customer tapping "send again" — say it as it is.
- The check belongs to this sale. A new sale needs a new code.
- The mock accepts the code `123456`.
