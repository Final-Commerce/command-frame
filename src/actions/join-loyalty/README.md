# joinLoyalty

Joins the customer on this sale to the programme and makes them the member on it. Someone already
in is found instead (`created: false`).

- **Staff mode:** the customer attached to the cart joins, with their name, email and phone from
  the customer record; `email`/`phone` fill in what the record lacks, or join someone with no
  customer on the sale.
- **Customer mode:** joins with the phone or email a confirmed check proved, and the `name` they
  typed. Without a confirmed check it is refused (`check_needed`); an email or phone passed here is
  ignored, because nobody proved it.

## Parameters

```typescript
interface JoinLoyaltyParams {
  name?: string;
  email?: string;
  phone?: string;
}
```

## Response

```typescript
interface JoinLoyaltyResponse {
  success: boolean;
  reason?: string;
  refusal?: CFLoyaltyRefusal; // not_live, check_needed, bad_request
  member: CFLoyaltyMember | null;
  created: boolean;
  timestamp: string;
}
```

## Notes

- Joining is not marketing consent: don't tick anything on the customer's behalf.
- A welcome bonus, when the programme has one, is on `member.balance` straight away.
