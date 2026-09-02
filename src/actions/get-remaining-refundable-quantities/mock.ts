import {
  GetRemainingRefundableQuantities,
  GetRemainingRefundableQuantitiesParams,
  GetRemainingRefundableQuantitiesResponse,
} from './types';

export const mockGetRemainingRefundableQuantities: GetRemainingRefundableQuantities = async (
  _params?: GetRemainingRefundableQuantitiesParams,
): Promise<GetRemainingRefundableQuantitiesResponse> => {
  console.log('[Mock] getRemainingRefundableQuantities called', _params);

  return {
    success: true,
    lineItems: {},
    customSales: {},
    cartFees: {},
    tips: {},
    timestamp: new Date().toISOString(),
  };
};
