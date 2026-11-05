import { describe, it, expect, vi } from 'vitest';
import { releaseFromCart } from './action';
import { mockReleaseFromCart } from './mock';
import { MOCK_CART, resetMockCart } from '../../demo/database';

vi.mock('../../client', () => ({
  commandFrameClient: {
    call: vi.fn(),
  },
}));

import { commandFrameClient } from '../../client';

const mockCall = vi.mocked(commandFrameClient).call;

describe('releaseFromCart action', () => {
  it('calls commandFrameClient with releaseFromCart', async () => {
    mockCall.mockResolvedValue({ success: true });

    await releaseFromCart();

    expect(mockCall).toHaveBeenCalledWith('releaseFromCart', undefined);
  });
});

describe('releaseFromCart mock', () => {
  it('rejects an empty cart', async () => {
    resetMockCart();
    await expect(mockReleaseFromCart()).rejects.toThrow('the cart is empty');
  });

  it('saves the cart as an unpaid draft out of the cart and clears the cart', async () => {
    MOCK_CART.products = [{ id: 'pizza', quantity: 1, price: 1500 } as never];
    MOCK_CART.total = 1500;

    const { order } = await mockReleaseFromCart();

    expect(order.paymentState).toBe('unpaid');
    expect(order.fulfillmentState).toBe('draft');
    expect(order.inCart?.active).toBe(false);
    expect(MOCK_CART.products).toEqual([]);
  });
});
