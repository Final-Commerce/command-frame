import { GetCurrentCart, GetCurrentCartResponse } from './types';
import { MOCK_CART, buildModifierRows, safeSerialize } from '../../demo/database';
import { extendPrice } from '@final-commerce/common';

export const mockGetCurrentCart: GetCurrentCart = async (): Promise<GetCurrentCartResponse> => {
  console.log('[Mock] getCurrentCart called');

  // The mock keeps no discounts or fees per line: a line is its price × quantity plus its modifier rows.
  const lineTotals = Object.fromEntries([
    ...MOCK_CART.products.map((line) => [
      line.internalId ?? line.id,
      extendPrice(line.price, line.quantity) + buildModifierRows(line.modifiers, line.quantity).modifiersTotal,
    ]),
    ...(MOCK_CART.customSales ?? []).map((sale) => [sale.id, extendPrice(sale.price, sale.quantity)]),
  ]);

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
