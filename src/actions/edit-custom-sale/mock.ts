import { MOCK_CART, mockPublishEvent } from '../../demo/database';
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

  // Remove the old line's contribution before applying the edit.
  const oldLineTotal = sale.price * sale.quantity;

  if (params.label !== undefined) sale.name = params.label;
  if (params.price !== undefined) {
    // FI-6991: price arrives as an INTEGER in MINOR units and is stored
    // directly — the engine throws on a fraction, so the mock does too.
    sale.price = requireMinorUnitsInteger(params.price, 'price');
  }
  if (params.quantity !== undefined) sale.quantity = params.quantity;
  if (params.applyTaxes !== undefined) sale.applyTaxes = params.applyTaxes;
  if (params.taxTableId !== undefined) sale.taxTableId = params.taxTableId;

  const newLineTotal = sale.price * sale.quantity;
  MOCK_CART.subtotal += newLineTotal - oldLineTotal;
  MOCK_CART.total += newLineTotal - oldLineTotal;
  MOCK_CART.amountToBeCharged = MOCK_CART.total;
  MOCK_CART.remainingBalance = MOCK_CART.total;

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
