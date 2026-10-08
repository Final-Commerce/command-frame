import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setOrderStatus } from './action';
import { mockSetOrderStatus } from './mock';
import { getOrderStatuses } from '../get-order-statuses/action';
import { mockGetOrderStatuses } from '../get-order-statuses/mock';
import { mockGetOrders } from '../get-orders/mock';
import { MOCK_ORDERS } from '../../demo/database';

vi.mock('../../client', () => ({
  commandFrameClient: {
    call: vi.fn(),
  },
}));

import { commandFrameClient } from '../../client';

const mockCall = vi.mocked(commandFrameClient).call;

describe('status actions', () => {
  it('forward to the host', async () => {
    mockCall.mockResolvedValue({ success: true });

    await setOrderStatus({ orderId: 'o1', statusId: 'in-kitchen' });
    await getOrderStatuses();

    expect(mockCall).toHaveBeenNthCalledWith(1, 'setOrderStatus', { orderId: 'o1', statusId: 'in-kitchen' });
    expect(mockCall).toHaveBeenNthCalledWith(2, 'getOrderStatuses', undefined);
  });
});

describe('status mocks', () => {
  const order = () => MOCK_ORDERS.find((o) => o._id === 'order_1004')!; // partially_paid × pending

  beforeEach(() => {
    order().customStatus = undefined;
    order().fulfillmentState = 'pending';
  });

  it('lists the demo statuses', async () => {
    const { statuses } = await mockGetOrderStatuses();
    expect(statuses.map((s) => s.id)).toContain('ready-for-pickup');
  });

  it('a bound status moves the fulfillment state and records the status', async () => {
    const response = await mockSetOrderStatus({ orderId: 'order_1004', statusId: 'ready-for-pickup' });

    expect(response.from).toEqual({ payment: 'partially_paid', fulfillment: 'pending' });
    expect(response.to).toEqual({ payment: 'partially_paid', fulfillment: 'in_progress' });
    expect(response.customStatus).toMatchObject({ id: 'ready-for-pickup', label: 'Ready for pickup' });
    expect((await mockGetOrders({ customStatusId: 'ready-for-pickup' })).orders.map((o) => o._id)).toEqual([
      'order_1004',
    ]);
  });

  it('a payment-gated status fails until the order is paid', async () => {
    await expect(mockSetOrderStatus({ orderId: 'order_1004', statusId: 'delivered' })).rejects.toThrow(
      'requires payment state paid',
    );
    expect(order().customStatus).toBeUndefined();
  });

  it('a label-only status leaves the state alone; null clears it', async () => {
    const set = await mockSetOrderStatus({ orderId: 'order_1004', statusId: 'driver-called' });
    expect(set.to).toEqual(set.from);

    const cleared = await mockSetOrderStatus({ orderId: 'order_1004', statusId: null });
    expect(cleared.customStatus).toBeNull();
  });

  it('rejects an unknown status', async () => {
    await expect(mockSetOrderStatus({ orderId: 'order_1004', statusId: 'nope' })).rejects.toThrow('unknown status');
  });
});
