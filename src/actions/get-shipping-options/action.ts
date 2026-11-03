/**
 * GetShippingOptions action
 * Calls the getShippingOptions action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { GetShippingOptions, GetShippingOptionsResponse } from './types';

export const getShippingOptions: GetShippingOptions = async (): Promise<GetShippingOptionsResponse> => {
  return await commandFrameClient.call<undefined, GetShippingOptionsResponse>('getShippingOptions', undefined);
};
