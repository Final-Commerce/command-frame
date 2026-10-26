/**
 * Release from cart action
 * Calls the releaseFromCart action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { ReleaseFromCart, ReleaseFromCartResponse } from './types';

export const releaseFromCart: ReleaseFromCart = async (): Promise<ReleaseFromCartResponse> => {
  return await commandFrameClient.call<undefined, ReleaseFromCartResponse>('releaseFromCart', undefined);
};
