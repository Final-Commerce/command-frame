import { GetProductVisibility, GetProductVisibilityParams, GetProductVisibilityResponse } from './types';

export const mockGetProductVisibility: GetProductVisibility = async (
  params: GetProductVisibilityParams,
): Promise<GetProductVisibilityResponse> => {
  console.log('[Mock] getProductVisibility called', params);

  return {
    success: true,
    hiddenOutletIds: [],
    timestamp: new Date().toISOString(),
  };
};
