/**
 * Start Checkout action
 * Calls the startCheckout action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { StartCheckout, StartCheckoutParams, StartCheckoutResponse } from './types';

export const startCheckout: StartCheckout = async (
  params: StartCheckoutParams,
): Promise<StartCheckoutResponse> => {
  return await commandFrameClient.call<StartCheckoutParams, StartCheckoutResponse>('startCheckout', params);
};
