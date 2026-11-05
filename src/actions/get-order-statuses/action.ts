/**
 * Get order statuses action
 * Calls the getOrderStatuses action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { GetOrderStatuses, GetOrderStatusesResponse } from './types';

export const getOrderStatuses: GetOrderStatuses = async (): Promise<GetOrderStatusesResponse> => {
  return await commandFrameClient.call<undefined, GetOrderStatusesResponse>('getOrderStatuses', undefined);
};
