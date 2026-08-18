import { GetStockHistory, GetStockHistoryParams, GetStockHistoryResponse } from './types';

export const mockGetStockHistory: GetStockHistory = async (
  params: GetStockHistoryParams,
): Promise<GetStockHistoryResponse> => {
  console.log('[Mock] getStockHistory called', params);

  return {
    success: true,
    entries: [],
    total: 0,
    timestamp: new Date().toISOString(),
  };
};
