/**
 * Void order action
 * Calls the voidOrder action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { VoidOrder, VoidOrderParams, VoidOrderResponse } from './types';

export const voidOrder: VoidOrder = async (params?: VoidOrderParams): Promise<VoidOrderResponse> => {
  return await commandFrameClient.call<VoidOrderParams, VoidOrderResponse>('voidOrder', params);
};
