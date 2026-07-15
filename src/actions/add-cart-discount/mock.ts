import { AddCartDiscount, AddCartDiscountParams, AddCartDiscountResponse } from './types';
import { MOCK_CART, mockPublishEvent } from '../../demo/database';

export const mockAddCartDiscount: AddCartDiscount = async (
  params?: AddCartDiscountParams,
): Promise<AddCartDiscountResponse> => {
  console.log('[Mock] addCartDiscount called', params);

  if (params) {
    // Contract (FI-6992): fixed `amount` arrives in integer MINOR units
    // (500 = $5); percent arrives 0-100 (50 = 50%). The stored cart shape
    // stays render-like: percent as a fraction (0.5), fixed as minor units.
    const value = params.isPercent ? params.amount / 100 : Math.round(params.amount);
    MOCK_CART.discount = {
      value,
      isPercent: params.isPercent,
      label: params.label,
    };
    if (params.isPercent) {
      MOCK_CART.total = MOCK_CART.subtotal * (1 - params.amount / 100);
    } else {
      MOCK_CART.total = MOCK_CART.subtotal - value;
    }
    MOCK_CART.amountToBeCharged = MOCK_CART.total;
    MOCK_CART.remainingBalance = MOCK_CART.total;

    // Publish cart-discount-added event
    mockPublishEvent('cart', 'cart-discount-added', {
      discount: MOCK_CART.discount,
    });
  }

  return {
    success: true,
    amount: params?.amount || 0,
    isPercent: params?.isPercent || false,
    label: params?.label || '',
    timestamp: new Date().toISOString(),
  };
};
