import { CFActiveCustomSales } from '../../CommonTypes';
import { MOCK_CART, mockPublishEvent } from '../../demo/database';
import { AddCustomSale, AddCustomSaleParams, AddCustomSaleResponse } from './types';
import { requireMinorUnitsInteger } from '../../demo/units';

export const mockAddCustomSale: AddCustomSale = async (
  params?: AddCustomSaleParams,
): Promise<AddCustomSaleResponse> => {
  console.log('[Mock] addCustomSale called', params);

  if (!params) throw new Error('Params required');

  // Simple mock ID generation
  const mockId = 'sale_' + Math.random().toString(36).substr(2, 9);
  // FI-6991: price arrives as an INTEGER in MINOR units (500 = $5.00) and is
  // stored directly — the engine throws on a fraction, so the mock does too.
  const price = requireMinorUnitsInteger(params.price, 'price');
  const quantity = params.quantity ?? 1;

  const customSale: CFActiveCustomSales = {
    id: mockId,
    name: params.label,
    price: price,
    quantity: quantity,
    applyTaxes: params.applyTaxes ?? false,
    taxTableId: params.taxTableId,
  };

  if (!MOCK_CART.customSales) {
    MOCK_CART.customSales = [];
  }

  MOCK_CART.customSales.push(customSale);

  // Update Cart Totals
  MOCK_CART.subtotal += price * quantity;
  MOCK_CART.total += price * quantity;
  MOCK_CART.amountToBeCharged = MOCK_CART.total;
  MOCK_CART.remainingBalance = MOCK_CART.total;

  // Publish custom-sale-added event so cart subscribers refresh
  mockPublishEvent('cart', 'custom-sale-added', { customSale });

  return {
    success: true,
    customSaleId: mockId,
    label: params.label,
    price: price,
    quantity: quantity,
    applyTaxes: params.applyTaxes ?? false,
    timestamp: new Date().toISOString(),
  };
};
