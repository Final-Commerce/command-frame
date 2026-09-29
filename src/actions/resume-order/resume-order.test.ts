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

  it('resumes an unpaid open order into draft and loads the cart', async () => {
    const response = await mockResumeOrder({ orderId: MOCK_PARKED_ORDER_2._id! });

    expect(response.from).toEqual({ payment: 'unpaid', fulfillment: 'pending' });
    expect(response.to).toEqual({ payment: 'unpaid', fulfillment: 'draft' });
    expect(MOCK_CART.total).toBe(MOCK_PARKED_ORDER_2.summary.total);
  });

  it('keeps a deposit-carrying order out of draft', async () => {
    const response = await mockResumeOrder({ orderId: 'order_1004' });

    expect(response.to).toEqual({ payment: 'partially_paid', fulfillment: 'in_progress' });
  });

  it('rejects a completed order', async () => {
    await expect(mockResumeOrder({ orderId: 'order_1001' })).rejects.toThrow('cannot be resumed from paid × fulfilled');
  });

  it('rejects a refunded order', async () => {
    await expect(mockResumeOrder({ orderId: 'order_1003' })).rejects.toThrow('cannot be resumed');
  });
});
