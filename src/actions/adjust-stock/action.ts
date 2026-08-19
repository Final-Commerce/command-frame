import { commandFrameClient } from '../../client';
import type { AdjustStock, AdjustStockParams, AdjustStockResponse } from './types';

export const adjustStock: AdjustStock = async (params: AdjustStockParams): Promise<AdjustStockResponse> => {
  return await commandFrameClient.call<AdjustStockParams, AdjustStockResponse>('adjustStock', params);
};
