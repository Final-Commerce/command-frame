/** Get orders summary action — counts and the money total of the orders `getOrders` would match, from the till. */
import { commandFrameClient } from '../../client';
import type { GetOrdersSummary, GetOrdersSummaryParams, GetOrdersSummaryResponse } from './types';

export const getOrdersSummary: GetOrdersSummary = async (
  params?: GetOrdersSummaryParams,
): Promise<GetOrdersSummaryResponse> => {
  return await commandFrameClient.call<GetOrdersSummaryParams | undefined, GetOrdersSummaryResponse>(
    'getOrdersSummary',
    params,
  );
};
