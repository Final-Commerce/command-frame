import type { RemoveCartFee, RemoveCartFeeParams, RemoveCartFeeResponse } from './types';
import { MOCK_CART, mockPublishEvent, recalculateMockCart } from '../../demo/database';

export const mockRemoveCartFee: RemoveCartFee = (params: RemoveCartFeeParams): Promise<RemoveCartFeeResponse> => {
  console.log('[Mock] removeCartFee called', params);

  const { index } = params;

  if (typeof index !== 'number' || !Number.isInteger(index) || index < 0) {
    throw new Error('removeCartFee requires a non-negative integer index');
  }

  const fees = MOCK_CART.customFee;
  if (!fees?.length) {
    throw new Error('Cart has no fees to remove');
  }
  if (index >= fees.length) {
    throw new Error(`Cart fee index ${index} is out of range (0–${fees.length - 1})`);
  }

  fees.splice(index, 1);
  if (fees.length === 0) {
    MOCK_CART.customFee = undefined;
  }

  recalculateMockCart();

  mockPublishEvent('cart', 'cart-fee-removed', { feeIndex: index });

  return Promise.resolve({
    success: true,
    timestamp: new Date().toISOString(),
  });
};
