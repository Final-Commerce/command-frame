import type { GetCashChange, GetCashChangeParams, GetCashChangeResponse } from './types';

// The mock does no money: change is the till's arithmetic (cash rounding included), so a screen sees the host's
// refusal instead of a number the mock made up.
export const mockGetCashChange: GetCashChange = async (params: GetCashChangeParams): Promise<GetCashChangeResponse> => {
  console.log('[Mock] getCashChange called', params);
  throw new Error('Cash change is computed by the till');
};
