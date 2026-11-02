import { RemoveProductFee, RemoveProductFeeParams, RemoveProductFeeResponse } from './types';
import { MOCK_CART, mockPublishEvent } from '../../demo/database';

export const mockRemoveProductFee: RemoveProductFee = (
  params?: RemoveProductFeeParams,
): Promise<RemoveProductFeeResponse> => {
  console.log('[Mock] removeProductFee called', params);

  const item = params?.internalId
    ? MOCK_CART.products.find((p) => p.internalId === params.internalId)
    : MOCK_CART.products[MOCK_CART.products.length - 1];

  if (item) {
    item.fees = [];
    // Publish so cart subscribers refresh.
    mockPublishEvent('cart', 'product-fee-removed', { internalId: params?.internalId });
  }

  return Promise.resolve({
    success: true,
    internalId: params?.internalId,
    timestamp: new Date().toISOString(),
  });
};
