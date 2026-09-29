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
    lineTotals,
    timestamp: new Date().toISOString(),
  };
};
