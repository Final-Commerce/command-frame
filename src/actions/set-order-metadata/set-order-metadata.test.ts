import { describe, it, expect, vi } from 'vitest';
import { setOrderMetadata } from './action';
import { mergeMetadata, mockSetOrderMetadata } from './mock';

vi.mock('../../client', () => ({
  commandFrameClient: {
    call: vi.fn(),
  },
}));

import { commandFrameClient } from '../../client';

const mockCall = vi.mocked(commandFrameClient).call;

describe('setOrderMetadata action', () => {
  it('calls commandFrameClient with setOrderMetadata and params', async () => {
    mockCall.mockResolvedValue({ success: true });

    await setOrderMetadata({ orderId: 'o1', metadata: { orderType: 'delivery' } });

    expect(mockCall).toHaveBeenCalledWith('setOrderMetadata', { orderId: 'o1', metadata: { orderType: 'delivery' } });
  });
});

describe('mergeMetadata', () => {
  it('sets, overwrites and removes keys, keeping the rest', () => {
    const current = [
      { key: 'orderType', value: 'pickup' },
      { key: 'driver', value: 'Sam' },
      { key: 'woo', value: '1', externalId: 'ext-1' },
    ];

    expect(mergeMetadata(current, { orderType: 'delivery', driver: null, eta: '18:30' })).toEqual([
      { key: 'orderType', value: 'delivery' },
      { key: 'woo', value: '1', externalId: 'ext-1' },
      { key: 'eta', value: '18:30' },
    ]);
  });
});

describe('setOrderMetadata mock', () => {
  it('rejects an empty change set', async () => {
    await expect(mockSetOrderMetadata({ metadata: {} })).rejects.toThrow('at least one key');
  });

  it('rejects an empty key and a non-string value', async () => {
    await expect(mockSetOrderMetadata({ metadata: { ' ': 'x' } })).rejects.toThrow('non-empty');
    await expect(mockSetOrderMetadata({ metadata: { n: 5 as unknown as string } })).rejects.toThrow('string or null');
  });

  it('keeps metadata on the live cart when no order is given', async () => {
    const first = await mockSetOrderMetadata({ metadata: { orderType: 'takeout' } });
    const second = await mockSetOrderMetadata({ metadata: { note: 'extra napkins' } });

    expect(first.orderId).toBeNull();
    expect(second.metadata).toEqual([
      { key: 'orderType', value: 'takeout' },
      { key: 'note', value: 'extra napkins' },
    ]);
  });

  it('updates an order by id', async () => {
    const response = await mockSetOrderMetadata({ orderId: 'order_1004', metadata: { orderType: 'delivery' } });

    expect(response.orderId).toBe('order_1004');
    expect(response.metadata).toContainEqual({ key: 'orderType', value: 'delivery' });
  });

  it('throws for an unknown order', async () => {
    await expect(mockSetOrderMetadata({ orderId: 'nope', metadata: { a: 'b' } })).rejects.toThrow(
      'Order with ID nope not found',
    );
  });
});
