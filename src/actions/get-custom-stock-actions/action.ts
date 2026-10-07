/**
 * Get custom stock actions action — the company's own stock adjustment actions.
 */

import { commandFrameClient } from '../../client';
import type { GetCustomStockActions, GetCustomStockActionsResponse } from './types';

export const getCustomStockActions: GetCustomStockActions = async (): Promise<GetCustomStockActionsResponse> => {
  return await commandFrameClient.call<undefined, GetCustomStockActionsResponse>('getCustomStockActions');
};
