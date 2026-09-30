import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resumeOrder } from './action';
import { mockResumeOrder } from './mock';
import { MOCK_PARKED_ORDER_2, setMockDatabase, MOCK_CART } from '../../demo/database';

vi.mock('../../client', () => ({
  commandFrameClient: {
    call: vi.fn(),
  },
}));

import { commandFrameClient } from '../../client';

const mockCall = vi.mocked(commandFrameClient).call;

describe('resumeOrder action', () => {
  beforeEach(() => {
    mockCall.mockClear();
  });

  it('calls commandFrameClient with resumeOrder and params', async () => {
    mockCall.mockResolvedValue({ success: true });

    await resumeOrder({ orderId: 'order-123' });

    expect(mockCall).toHaveBeenCalledTimes(1);
    expect(mockCall).toHaveBeenCalledWith('resumeOrder', { orderId: 'order-123' });
  });
});

describe('resumeOrder mock', () => {
  beforeEach(() => {
    setMockDatabase({ parkedOrders: [MOCK_PARKED_ORDER_2] });
  });

  it('throws without an orderId', async () => {
    await expect(mockResumeOrder({ orderId: '' })).rejects.toThrow('Order ID is required');
  });

  it('throws for an unknown order', async () => {
    await expect(mockResumeOrder({ orderId: 'nope' })).rejects.toThrow('Order with ID nope not found');
  });

  it('resumes an unpaid pending order, keeping its state, and loads the cart', async () => {
    const response = await mockResumeOrder({ orderId: MOCK_PARKED_ORDER_2._id! });

    expect(response.from).toEqual({ payment: 'unpaid', fulfillment: 'pending' });
    expect(response.to).toEqual({ payment: 'unpaid', fulfillment: 'pending' });
    expect(response.order.inCart?.active).toBe(true);
    expect(MOCK_CART.total).toBe(MOCK_PARKED_ORDER_2.summary.total);
  });

  it('keeps a deposit-carrying order in its state', async () => {
    const response = await mockResumeOrder({ orderId: 'order_1004' });

    expect(response.to).toEqual({ payment: 'partially_paid', fulfillment: 'pending' });
  });

  it('moves a parked deposit order off on_hold, never back to draft', async () => {
    setMockDatabase({
      parkedOrders: [{ ...MOCK_PARKED_ORDER_2, paymentState: 'partially_paid', fulfillmentState: 'on_hold' }],
    });

    const response = await mockResumeOrder({ orderId: MOCK_PARKED_ORDER_2._id! });

    expect(response.to).toEqual({ payment: 'partially_paid', fulfillment: 'in_progress' });
  });

  it('rejects an order already in a cart', async () => {
    setMockDatabase({
      parkedOrders: [
        { ...MOCK_PARKED_ORDER_2, inCart: { active: true, stationId: 's2', since: '2026-09-30T18:00:00.000Z' } },
      ],
    });

    await expect(mockResumeOrder({ orderId: MOCK_PARKED_ORDER_2._id! })).rejects.toThrow('already in a cart');
  });

  it('rejects a completed order', async () => {
    await expect(mockResumeOrder({ orderId: 'order_1001' })).rejects.toThrow('cannot be resumed from paid × fulfilled');
  });

  it('rejects a refunded order', async () => {
    await expect(mockResumeOrder({ orderId: 'order_1003' })).rejects.toThrow('cannot be resumed');
  });
});
