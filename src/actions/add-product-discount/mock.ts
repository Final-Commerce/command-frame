import { AddProductDiscount, AddProductDiscountParams, AddProductDiscountResponse } from './types';
import { MOCK_CART } from '../../demo/database';

export const mockAddProductDiscount: AddProductDiscount = async (
  params?: AddProductDiscountParams,
): Promise<AddProductDiscountResponse> => {
  console.log('[Mock] addProductDiscount called', params);

  if (params && (params.amount > 0 || params.amount < 0)) {
    // Allow 0 to clear discount if logic permits
    let item = null;
    if (params.internalId) {
      item = MOCK_CART.products.find((p) => p.internalId === params.internalId);
    } else if (MOCK_CART.products.length > 0) {
      item = MOCK_CART.products[MOCK_CART.products.length - 1];
    }

    if (item) {
      // Contract (FI-6992): fixed `amount` arrives in integer MINOR units;
      // percent arrives 0-100. Store render-like: fraction / minor units.
      item.discounts = [
        {
          value: params.isPercent ? params.amount / 100 : params.amount,
          isPercent: params.isPercent || false,
          label: params.label,
        },
      ];

      // Recalculate cart totals (simplified)
      // Ideally, this should trigger a full recalculation function
    }
  }

  return {
    success: true,
    amount: params?.amount || 0,
    isPercent: params?.isPercent || false,
    label: params?.label || '',
    internalId: params?.internalId,
    timestamp: new Date().toISOString(),
  };
};
