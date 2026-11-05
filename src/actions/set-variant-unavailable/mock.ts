import { SetVariantUnavailable, SetVariantUnavailableParams, SetVariantUnavailableResponse } from './types';
import { MOCK_OUTLET, MOCK_PRODUCTS } from '../../demo/database';

export const mockSetVariantUnavailable: SetVariantUnavailable = async (
  params?: SetVariantUnavailableParams,
): Promise<SetVariantUnavailableResponse> => {
  console.log('[Mock] setVariantUnavailable called', params);
  const answer = (success: boolean, reason?: string) => ({
    success,
    reason,
    variantId: params?.variantId ?? '',
    outletId: MOCK_OUTLET.id,
    unavailable: !!params?.unavailable,
    timestamp: new Date().toISOString(),
  });
  // Same refusals and texts as the host, resolved instead of thrown.
  if (!params?.variantId || typeof params.unavailable !== 'boolean') {
    return answer(false, 'variantId and unavailable are required');
  }
  const { variantId, unavailable } = params;
  const variant = MOCK_PRODUCTS.flatMap((product) => product.variants).find((v) => v._id === variantId);
  if (!variant) return answer(false, `Variant with ID ${variantId} not found`);
  variant.unavailable = unavailable;
  return answer(true);
};
