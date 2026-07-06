# sendEmail

Emails the customer the **active order's receipt** (not an arbitrary email). Reuses the host's
existing `POST /receipt/send/:companyId/:id` endpoint. Omitting all params emails the active
order's receipt to the active customer. Online only.

## Parameters

- `email` (string, optional): Recipient email. Defaults to the active customer's email.
- `orderId` (string, optional): Order id to send the receipt for. Defaults to the active order.
- `refundId` (string, optional): Refund id — **required** when `type` is `'refund'`.
- `type` (`'order' | 'refund'`, optional): Defaults to `'order'`.

## Response

```typescript
interface SendEmailResponse {
  success: boolean;
  channel: 'email';
  email: string;
  entityId: string; // the order or refund id
  type: 'order' | 'refund';
  timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Email the active order's receipt to the active customer
await command.sendEmail();

// Email a specific order's receipt to an explicit address
await command.sendEmail({ email: 'buyer@example.com', orderId: 'order_123' });

// Email a refund receipt
await command.sendEmail({ type: 'refund', refundId: 'refund_123' });
```

## Error Handling

- Throws if there is no active company.
- Throws if `type` is `'refund'` and no `refundId` is provided.
- Throws if `type` is `'order'` and no active/explicit order can be resolved.
- Throws if no recipient email can be resolved.
- Throws (rather than reporting a false success) when offline.
