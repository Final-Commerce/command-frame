import { AddCartDiscount, AddCartDiscountParams, AddCartDiscountResponse } from './types';
import { MOCK_CART, mockPublishEvent } from '../../demo/database';
import { percentToFraction, requireMinorUnitsInteger } from '../../demo/units';

export const mockAddCartDiscount: AddCartDiscount = async (
  params?: AddCartDiscountParams,
): Promise<AddCartDiscountResponse> => {
  console.log('[Mock] addCartDiscount called', params);

  if (params) {
    // FI-6991: a fixed amount arrives as an INTEGER in MINOR units (500 =
    // $5.00) and is stored directly; a percent arrives raw (50 = 50%) and is
    // stored as a fraction (0.5). Same as the real handler.
    const value = params.isPercent
      ? percentToFraction(params.amount)
      : requireMinorUnitsInteger(params.amount, 'Discount amount');
    MOCK_CART.discount = {
      value,
      isPercent: params.isPercent,
      label: params.label,
    };
    if (params.isPercent) {
      MOCK_CART.total = MOCK_CART.subtotal * (1 - value);
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
