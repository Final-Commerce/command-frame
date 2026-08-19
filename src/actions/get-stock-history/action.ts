import { commandFrameClient } from '../../client';
import type { GetStockHistory, GetStockHistoryParams, GetStockHistoryResponse } from './types';

export const getStockHistory: GetStockHistory = async (
  params: GetStockHistoryParams,
): Promise<GetStockHistoryResponse> => {
  return await commandFrameClient.call<GetStockHistoryParams, GetStockHistoryResponse>('getStockHistory', params);
};
