import { AddCartDiscount, AddCartDiscountParams, AddCartDiscountResponse } from './types';
import { MOCK_CART, mockPublishEvent, recalculateMockCart } from '../../demo/database';
import { assertValidDiscount } from '../../demo/units';

/** The host's handler (kaching add-cart-discount/handler.ts, actionHelpers.ts:126-152): same refusals, same stored value. */
export const mockAddCartDiscount: AddCartDiscount = async (
  params?: AddCartDiscountParams,
): Promise<AddCartDiscountResponse> => {
  console.log('[Mock] addCartDiscount called', params);

  if (!params) throw new Error('Parameters are required for addCartDiscount');
  const { amount, isPercent, label } = params;
  if (amount === undefined || amount === null) throw new Error('Discount amount is required');
  assertValidDiscount(amount, isPercent || false);
  if (!isPercent && !Number.isInteger(Number(amount))) {
    throw new Error('Discount amount must be an integer in minor currency units (e.g. 1575 = $15.75)');
  }

  // A fixed amount is stored as sent (minor units). A percent is stored as a fraction of WHOLE percents: the host
  // parses it with parseInt, so 12.5 becomes 12%.
  MOCK_CART.discount = {
    value: isPercent ? parseInt(String(amount)) / 100 : Number(amount),
    isPercent: !!isPercent,
    label: label || 'Discount',
  };
  recalculateMockCart();
  mockPublishEvent('cart', 'cart-discount-added', { discount: MOCK_CART.discount });

  return {
    success: true,
    amount,
    isPercent: isPercent || false,
    label: label || 'Discount',
    timestamp: new Date().toISOString(),
  };
};
