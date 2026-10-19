/**
 * Get Checkout Status action
 * Calls the getCheckoutStatus action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { GetCheckoutStatus, GetCheckoutStatusParams, GetCheckoutStatusResponse } from './types';

export const getCheckoutStatus: GetCheckoutStatus = async (
  params: GetCheckoutStatusParams,
): Promise<GetCheckoutStatusResponse> => {
  return await commandFrameClient.call<GetCheckoutStatusParams, GetCheckoutStatusResponse>('getCheckoutStatus', params);
};
