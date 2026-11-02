import { RemoveCartDiscount, RemoveCartDiscountResponse } from './types';
import { MOCK_CART, mockPublishEvent, recalculateMockCart } from '../../demo/database';

export const mockRemoveCartDiscount: RemoveCartDiscount = async (): Promise<RemoveCartDiscountResponse> => {
  console.log('[Mock] removeCartDiscount called');

  if (MOCK_CART.discount) {
    delete MOCK_CART.discount;
    recalculateMockCart();
    mockPublishEvent('cart', 'cart-discount-removed', {});
  }

  return {
    success: true,
    timestamp: new Date().toISOString(),
  };
};
