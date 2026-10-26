/**
 * Set order type action
 * Calls the setOrderType action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { SetOrderType, SetOrderTypeParams, SetOrderTypeResponse } from './types';

export const setOrderType: SetOrderType = async (params: SetOrderTypeParams): Promise<SetOrderTypeResponse> => {
  return await commandFrameClient.call<SetOrderTypeParams, SetOrderTypeResponse>('setOrderType', params);
};
