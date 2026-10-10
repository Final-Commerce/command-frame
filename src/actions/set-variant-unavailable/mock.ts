import { SetVariantUnavailable, SetVariantUnavailableParams, SetVariantUnavailableResponse } from './types';
import { MOCK_OUTLET, MOCK_PRODUCTS } from '../../demo/database';

export const mockSetVariantUnavailable: SetVariantUnavailable = async (
  params?: SetVariantUnavailableParams,
): Promise<SetVariantUnavailableResponse> => {
  console.log('[Mock] setVariantUnavailable called', params);
  if (!params?.variantId) throw new Error('variantId is required');
  const { variantId, unavailable } = params;
  const variant = MOCK_PRODUCTS.flatMap((product) => product.variants).find((v) => v._id === variantId);
  if (!variant) throw new Error(`Variant with ID ${variantId} not found`);
  variant.unavailable = unavailable;
  return { success: true, variantId, outletId: MOCK_OUTLET.id, unavailable, timestamp: new Date().toISOString() };
};
