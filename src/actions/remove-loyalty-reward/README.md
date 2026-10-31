# removeLoyaltyReward

Takes a reward or an offer the host applied off the cart, and gives its stamps or points back.
Taking the discount off any other way (removing the line, clearing the cart, removing the member)
gives them back too; this is the button for "don't use it after all".

## Parameters

```typescript
interface RemoveLoyaltyRewardParams {
  redemptionId: string; // applied.redemptionId
}
```

## Response

```typescript
interface RemoveLoyaltyRewardResponse {
  success: boolean;
  reason?: string;
  refusal?: CFLoyaltyRefusal; // not_found
  timestamp: string;
}
```
