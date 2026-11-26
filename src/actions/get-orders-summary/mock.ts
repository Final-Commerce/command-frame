import type { GetOrdersSummary, GetOrdersSummaryParams, GetOrdersSummaryResponse } from './types';

// The mock does no money: totals and shares are the till's, so it refuses the way the host refuses, not with mock maths.
export const mockGetOrdersSummary: GetOrdersSummary = async (
  params?: GetOrdersSummaryParams,
): Promise<GetOrdersSummaryResponse> => {
  console.log('[Mock] getOrdersSummary called', params);
  return { success: false, reason: 'The orders summary is computed by the till', timestamp: new Date().toISOString() };
};
