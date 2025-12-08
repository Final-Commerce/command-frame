# addCustomerNote

Adds a note to a customer's record.

## Parameters

- `customerId` (string, required): The ID of the customer
- `note` (string, required): The note text to add

## Response

```typescript
{
  success: boolean;
  customerId: string;
  note: string;
  timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Add a note to a customer
await command.addCustomerNote({
  customerId: '691df9c6c478bada1fb23d31',
  note: 'Preferred delivery time: 2-4pm'
});
```

## Error Handling

- Throws an error if customerId or note is missing
- Throws an error if the customer is not found

