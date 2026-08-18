import { GetInventory, GetInventoryParams, GetInventoryResponse } from './types';

export const mockGetInventory: GetInventory = async (params: GetInventoryParams): Promise<GetInventoryResponse> => {
  console.log('[Mock] getInventory called', params);

  return {
    success: true,
    rows: [],
    timestamp: new Date().toISOString(),
  };
};
