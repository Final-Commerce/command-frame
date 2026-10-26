import { describe, it, expect, vi } from 'vitest';
import { getOrders } from './action';
import { mockGetOrders } from './mock';

vi.mock('../../client', () => ({
  commandFrameClient: {
    call: vi.fn(),
  },
}));

import { commandFrameClient } from '../../client';

const mockCall = vi.mocked(commandFrameClient).call;

describe('getOrders action', () => {
  it('forwards the state and outlet filters to the host', async () => {
    mockCall.mockResolvedValue({ success: true, orders: [], total: 0 });

    await getOrders({ fulfillmentState: ['pending', 'in_progress'], paymentState: 'paid', outletId: 'outlet_main' });

    expect(mockCall).toHaveBeenCalledWith('getOrders', {
      fulfillmentState: ['pending', 'in_progress'],
      paymentState: 'paid',
      outletId: 'outlet_main',
    });
  });
});

describe('getOrders mock', () => {
  it('filters by a single fulfillment state', async () => {
    const { orders } = await mockGetOrders({ fulfillmentState: 'fulfilled' });

    expect(orders.length).toBeGreaterThan(0);
    expect(orders.every((o) => o.fulfillmentState === 'fulfilled')).toBe(true);
  });

  it('treats a list as any-of', async () => {
    const { orders } = await mockGetOrders({ paymentState: ['unpaid', 'partially_paid'] });

    expect(orders.length).toBeGreaterThan(0);
    expect(orders.every((o) => o.paymentState === 'unpaid' || o.paymentState === 'partially_paid')).toBe(true);
  });

  it('combines filters with AND', async () => {
    const both = await mockGetOrders({ paymentState: 'partially_paid', fulfillmentState: 'pending' });
    const mismatch = await mockGetOrders({ paymentState: 'partially_paid', fulfillmentState: 'fulfilled' });

    expect(both.orders.map((o) => o._id)).toEqual(['order_1004']);
    expect(mismatch.orders).toEqual([]);
  });

  it('filters by inCart with the legacy fallback', async () => {
    const released = await mockGetOrders({ inCart: false });
    const inCart = await mockGetOrders({ inCart: true });

    // No demo order is a draft or carries an active flag.
    expect(inCart.orders).toEqual([]);
    expect(released.orders.length).toBeGreaterThan(0);
  });

  it('assignedUserId: null keeps only unassigned orders', async () => {
    const all = await mockGetOrders({});
    const unassigned = await mockGetOrders({ assignedUserId: null });

    expect(unassigned.orders.every((o) => o.assignedUser == null)).toBe(true);
    expect(unassigned.orders.length).toBe(all.orders.filter((o) => o.assignedUser == null).length);
  });

  it('filters by outlet', async () => {
    const main = await mockGetOrders({ outletId: 'outlet_main', fulfillmentState: 'fulfilled' });
    const none = await mockGetOrders({ outletId: 'no-such-outlet' });

    expect(main.orders.length).toBeGreaterThan(0);
    expect(none.orders).toEqual([]);
  });
});
