# resetRefundDetails

Clears all refund selections (quantities, custom sales, cart fees, tips, and stock actions).

## Parameters

None.

## Response

`Promise<ResetRefundDetailsResponse>`

| Field       | Type     | Description                               |
| :---------- | :------- | :---------------------------------------- |
| `success`   | `boolean` | `true` if the refund details were reset successfully. |
| `timestamp` | `string` | ISO date string of when the action occurred. |

## Example Usage

```typescript
import { commands } from '@final-commerce/command-frame';

try {
  // Clear all refund selections
  const result = await commands.resetRefundDetails();
  console.log('Refund details reset:', result);
  // Expected output:
  // {
  //   success: true,
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }

} catch (error) {
  console.error('Failed to reset refund details:', error);
}
```

## Error Handling

This action typically does not throw errors unless there's an underlying system issue.

## Notes

- This clears all refund selections and resets the refund state.
- Useful when starting a new refund or canceling the current refund process.

