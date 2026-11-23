/**
 * Get cash change action — what a cash tender would give back, computed by the till exactly as `cashPayment` computes
 * it (after cash rounding). Read-only: nothing is paid.
 */
import { commandFrameClient } from '../../client';
import type { GetCashChange, GetCashChangeParams, GetCashChangeResponse } from './types';

export const getCashChange: GetCashChange = async (params: GetCashChangeParams): Promise<GetCashChangeResponse> => {
  return await commandFrameClient.call<GetCashChangeParams, GetCashChangeResponse>('getCashChange', params);
};
