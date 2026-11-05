import { describe, it, expect, vi } from 'vitest';
import { setOrderType } from './action';
import { mockSetOrderType, normalizeOrderType } from './mock';
import { mockGetOrders } from '../get-orders/mock';

vi.mock('../../client', () => ({
  commandFrameClient: {
    call: vi.fn(),
  },
}));

import { commandFrameClient } from '../../client';

const mockCall = vi.mocked(commandFrameClient).call;

describe('setOrderType action', () => {
  it('calls commandFrameClient with setOrderType and params', async () => {
    mockCall.mockResolvedValue({ success: true });

    await setOrderType({ orderId: 'o1', orderType: 'delivery' });

    expect(mockCall).toHaveBeenCalledWith('setOrderType', { orderId: 'o1', orderType: 'delivery' });
  });
});

describe('normalizeOrderType', () => {
  it('accepts any non-empty label, trimmed, and null', () => {
    expect(normalizeOrderType(' Curbside ')).toBe('Curbside');
    expect(normalizeOrderType(null)).toBeNull();
  });

  it('rejects empty and non-string values', () => {
    expect(() => normalizeOrderType('  ')).toThrow('non-empty string or null');
    expect(() => normalizeOrderType(3)).toThrow('non-empty string or null');
  });
});

describe('setOrderType mock', () => {
  it('labels an order, filters by it, then clears it', async () => {
    await mockSetOrderType({ orderId: 'order_1004', orderType: 'delivery' });
    expect((await mockGetOrders({ orderType: 'delivery' })).orders.map((o) => o._id)).toEqual(['order_1004']);
    expect((await mockGetOrders({ orderType: ['pickup', 'delivery'] })).orders.map((o) => o._id)).toEqual([
      'order_1004',
    ]);

    await mockSetOrderType({ orderId: 'order_1004', orderType: null });
    expect((await mockGetOrders({ orderType: 'delivery' })).orders).toEqual([]);
  });

  it('keeps a type on the live cart when no order is given', async () => {
    const response = await mockSetOrderType({ orderType: 'takeout' });
    expect(response).toMatchObject({ orderId: null, orderType: 'takeout' });
  });

  it('throws for an unknown order', async () => {
    await expect(mockSetOrderType({ orderId: 'nope', orderType: 'delivery' })).rejects.toThrow(
      'Order with ID nope not found',
    );
  });
});
