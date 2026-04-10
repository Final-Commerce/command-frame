# setActiveCustomer

Sets the active customer on the POS by loading the customer document from local data using `customerId`.

## Parameters

| Field         | Type     | Required | Description        |
| :------------ | :------- | :------- | :----------------- |
| `customerId`  | `string` | Yes      | Customer `_id`.    |

## Response

`Promise<SetActiveCustomerResponse>` with `success`, `customer` ([`CFActiveCustomer`](../../types/README.md#cfactivecustomer)), and `timestamp`.

## Example Usage

```typescript
await command.setActiveCustomer({ customerId: 'cust_123' });
```

## Error Handling

Throws if `customerId` is missing or the customer is not found.
