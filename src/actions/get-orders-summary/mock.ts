import type { GetOrdersSummary, GetOrdersSummaryParams, GetOrdersSummaryResponse } from './types';

// The mock does no money: totals and shares are the till's, so a screen sees the host's refusal, not mock maths.
export const mockGetOrdersSummary: GetOrdersSummary = async (
  params?: GetOrdersSummaryParams,
): Promise<GetOrdersSummaryResponse> => {
  console.log('[Mock] getOrdersSummary called', params);
  throw new Error('The orders summary is computed by the till');
};
