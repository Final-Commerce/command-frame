import { GetCurrentCart, GetCurrentCartResponse } from './types';
import { MOCK_CART, safeSerialize } from '../../demo/database';

export const mockGetCurrentCart: GetCurrentCart = async (): Promise<GetCurrentCartResponse> => {
  console.log('[Mock] getCurrentCart called');

  return {
    success: true,
    cart: safeSerialize(MOCK_CART),
    // Every mock tender settles the whole sale and clears the cart, so the demo cart
    // never holds an order with money on it — nothing to lock.
    itemsLocked: false,
    timestamp: new Date().toISOString(),
  };
};
