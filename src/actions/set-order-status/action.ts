/**
 * Set order status action
 * Calls the setOrderStatus action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { SetOrderStatus, SetOrderStatusParams, SetOrderStatusResponse } from './types';

export const setOrderStatus: SetOrderStatus = async (params: SetOrderStatusParams): Promise<SetOrderStatusResponse> => {
  return await commandFrameClient.call<SetOrderStatusParams, SetOrderStatusResponse>('setOrderStatus', params);
};
