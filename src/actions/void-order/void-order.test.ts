import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mockVoidOrder } from './mock';
import { MOCK_ORDERS } from '../../demo/database';
import type { CFActiveOrder } from '../../CommonTypes';

// The mock mirrors the runtime: no orderId means the order in the cart, never just any
// order — a finished sale kept for receipts is not it.
const NOW = '2026-10-21T12:00:00.000Z';
const order = (over: Partial<CFActiveOrder> & { _id: string }) =>
  ({ status: 'completed', lineItems: [], customSales: [], paymentMethods: [], ...over }) as unknown as CFActiveOrder;

describe('voidOrder mock', () => {
  let saved: CFActiveOrder[];
  beforeEach(() => {
    saved = MOCK_ORDERS.splice(0, MOCK_ORDERS.length);
  });
  afterEach(() => {
    MOCK_ORDERS.splice(0, MOCK_ORDERS.length, ...saved);
  });

  it('refuses an id-less void when only a finished sale is held (paid, sent to the kitchen)', async () => {
    MOCK_ORDERS.push(
      order({
        _id: 'paid-kitchen',
        paymentState: 'paid',
        fulfillmentState: 'pending',
        paymentMethods: [{ amount: 450 }] as never,
        inCart: { active: false, stationId: null, since: NOW },
      }),
    );

    await expect(mockVoidOrder({})).rejects.toThrow('No order selected. Please provide orderId.');
    expect(MOCK_ORDERS[0].paymentState).toBe('paid');
  });

  it('voids the order that is in the cart when no id is given', async () => {
    MOCK_ORDERS.push(
      order({ _id: 'finished', paymentState: 'paid', fulfillmentState: 'fulfilled' }),
      order({
        _id: 'in-cart',
        paymentState: 'partially_paid',
        fulfillmentState: 'draft',
        paymentMethods: [{ amount: 200 }] as never,
        inCart: { active: true, stationId: null, since: NOW },
      }),
    );

    const res = await mockVoidOrder({});

    expect(res).toMatchObject({ success: true, orderId: 'in-cart', outcome: 'refunded' });
  });

  it('never takes a paid legacy order with no cart flag as the cart’s order', async () => {
    MOCK_ORDERS.push(order({ _id: 'legacy-paid', paymentState: 'paid', fulfillmentState: 'draft' }));

    await expect(mockVoidOrder({})).rejects.toThrow('No order selected');
  });

  it('voids a paid order still in the kitchen by id, refunding it', async () => {
    MOCK_ORDERS.push(
      order({
        _id: 'paid-kitchen',
        paymentState: 'paid',
        fulfillmentState: 'pending',
        paymentMethods: [{ amount: 450 }] as never,
        inCart: { active: false, stationId: null, since: NOW },
      }),
    );

    const res = await mockVoidOrder({ orderId: 'paid-kitchen' });

    expect(res).toMatchObject({ orderId: 'paid-kitchen', outcome: 'refunded' });
  });
});
