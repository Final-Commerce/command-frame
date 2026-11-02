import { MOCK_CART, mockPublishEvent, recalculateMockCart } from '../../demo/database';
import { EditCustomSale, EditCustomSaleParams, EditCustomSaleResponse } from './types';
import { requireMinorUnitsInteger } from '../../demo/units';

export const mockEditCustomSale: EditCustomSale = async (
  params?: EditCustomSaleParams,
): Promise<EditCustomSaleResponse> => {
  console.log('[Mock] editCustomSale called', params);

  if (!params) throw new Error('Params required');
  if (!params.customSaleId) throw new Error('customSaleId is required');

  const sale = (MOCK_CART.customSales ?? []).find((s) => s.id === params.customSaleId);
  if (!sale) throw new Error(`Custom sale '${params.customSaleId}' not found in cart`);

  if (params.label !== undefined) sale.name = params.label;
  if (params.price !== undefined) {
    // FI-6991: price arrives as an INTEGER in MINOR units and is stored
    // directly — the engine throws on a fraction, so the mock does too.
    sale.price = requireMinorUnitsInteger(params.price, 'price');
  }
  if (params.quantity !== undefined) sale.quantity = params.quantity;
  if (params.applyTaxes !== undefined) sale.applyTaxes = params.applyTaxes;
  if (params.taxTableId !== undefined) sale.taxTableId = params.taxTableId;

  recalculateMockCart();

  // Publish custom-sale-updated event so cart subscribers refresh
  mockPublishEvent('cart', 'custom-sale-updated', { customSale: sale });

  return {
    success: true,
    customSaleId: sale.id,
    label: sale.name,
    price: sale.price,
    quantity: sale.quantity,
    applyTaxes: sale.applyTaxes ?? false,
    timestamp: new Date().toISOString(),
  };
};
