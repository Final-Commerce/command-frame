# getCustomStockActions

Returns the stock adjustment actions the current company created for itself (in the back office or via the hub API).

## Parameters

None.

## Response

### `GetCustomStockActionsResponse`

```typescript
interface GetCustomStockActionsResponse {
  customStockActions: CustomStockActionPayload[];
  timestamp: string;
}

interface CustomStockActionPayload {
  _id: string;
  name: string;
  baseAction: 'ADD' | 'REMOVE' | 'RECOUNT';
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const { customStockActions } = await command.getCustomStockActions();
const loan = customStockActions.find((a) => a.name === 'Exhibition loan');

// The stockType must match the action's baseAction: ADD → 'add', REMOVE → 'subtract', RECOUNT → 'set'.
await command.adjustInventory({
  amount: '1',
  stockType: 'subtract',
  variantId: 'variant-123',
  customActionId: loan._id,
});
```

## Notes

- Required on `RenderProviderActions`.
- Deleted actions are not returned.
