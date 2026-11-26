import type { GetCashChange, GetCashChangeParams, GetCashChangeResponse } from './types';

// The mock does no money: change is the till's arithmetic (cash rounding included), so it refuses the way the host
// refuses, instead of a number the mock made up.
export const mockGetCashChange: GetCashChange = async (params: GetCashChangeParams): Promise<GetCashChangeResponse> => {
  console.log('[Mock] getCashChange called', params);
  return { success: false, reason: 'Cash change is computed by the till', timestamp: new Date().toISOString() };
};
