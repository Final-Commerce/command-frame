# sendSms

Texts the customer the **active order's receipt** (not an arbitrary SMS). Reuses the host's
existing `POST /receipt/send/:companyId/:id` endpoint. Omitting all params texts the active
order's receipt to the active customer. The phone
must be E.164 (the endpoint rejects other formats). Online only.

## Parameters

- `phone` (string, optional): Recipient phone in E.164 format (e.g. `+15555550123`). Defaults to the active customer's phone.
- `orderId` (string, optional): Order id to send the receipt for. Defaults to the active order.
- `refundId` (string, optional): Refund id — **required** when `type` is `'refund'`.
- `type` (`'order' | 'refund'`, optional): Defaults to `'order'`.

## Response

```typescript
interface SendSmsResponse {
  success: boolean;
  channel: 'text';
  phone: string;
  entityId: string; // the order or refund id
  type: 'order' | 'refund';
  timestamp: string;
}
```

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

// Text the active order's receipt to the active customer
await command.sendSms();

// Text a specific order's receipt to an explicit number
await command.sendSms({ phone: '+15555550123', orderId: 'order_123' });

// Text a refund receipt
await command.sendSms({ type: 'refund', refundId: 'refund_123' });
```

## Error Handling

- Throws if there is no active company.
- Throws if `type` is `'refund'` and no `refundId` is provided.
- Throws if `type` is `'order'` and no active/explicit order can be resolved.
- Throws if no recipient phone can be resolved.
- Throws (rather than reporting a false success) when offline.
