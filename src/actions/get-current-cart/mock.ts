import { GetCurrentCart, GetCurrentCartResponse } from './types';
import { MOCK_CART, MOCK_CART_MATH, safeSerialize } from '../../demo/database';

export const mockGetCurrentCart: GetCurrentCart = async (): Promise<GetCurrentCartResponse> => {
  console.log('[Mock] getCurrentCart called');

  // What each line adds, as the cart's recompute summed it into `subtotal` — products and bookings by internalId,
  // custom sales by id (kaching get-current-cart/handler.ts).
  const lineTotals = Object.fromEntries(
    Object.entries(MOCK_CART_MATH?.lines ?? {}).map(([lineId, line]) => [lineId, line.lineDisplayWithFee]),
  );

  return {
    success: true,
    cart: safeSerialize(MOCK_CART),
    // Every mock tender settles the whole sale and clears the cart, so the demo cart
    // never holds an order with money on it — nothing to lock.
    itemsLocked: false,
    lineTotals,
    timestamp: new Date().toISOString(),
  };
};
