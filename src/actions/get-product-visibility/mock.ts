import { MOCK_HIDDEN_OUTLETS } from '../../demo/database';
import { GetProductVisibility, GetProductVisibilityParams, GetProductVisibilityResponse } from './types';

export const mockGetProductVisibility: GetProductVisibility = async (
  params: GetProductVisibilityParams,
): Promise<GetProductVisibilityResponse> => {
  console.log('[Mock] getProductVisibility called', params);

  // Absence of a key = no CV docs = visible everywhere (§6.4).
  return {
    success: true,
    hiddenOutletIds: [...(MOCK_HIDDEN_OUTLETS[params.productId] ?? [])],
    timestamp: new Date().toISOString(),
  };
};
