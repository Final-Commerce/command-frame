# getActiveCustomer

Retrieves the customer currently assigned to the POS session (active cart context), or `null` if none.

## Parameters

None.

## Response

`Promise<GetActiveCustomerResponse>`

| Field       | Type     | Description |
| :---------- | :------- | :---------- |
| `success`   | `boolean` | `true` on success. |
| `customer`  | [`CFActiveCustomer`](../../types/README.md#cfactivecustomer) ` \| null` | Active customer or `null`. |
| `timestamp` | `string` | ISO timestamp. |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

const { customer } = await command.getActiveCustomer();
```

## Notes

- Pair with [`setActiveCustomer`](../set-active-customer/README.md) to load a customer by id from the host database.
