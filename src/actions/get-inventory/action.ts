import { commandFrameClient } from '../../client';
import type { GetInventory, GetInventoryParams, GetInventoryResponse } from './types';

export const getInventory: GetInventory = async (params: GetInventoryParams): Promise<GetInventoryResponse> => {
  return await commandFrameClient.call<GetInventoryParams, GetInventoryResponse>('getInventory', params);
};
