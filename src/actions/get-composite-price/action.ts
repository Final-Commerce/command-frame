/**
 * Get composite price action (read-only)
 * Calls the getCompositePrice action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { GetCompositePrice, GetCompositePriceParams, GetCompositePriceResponse } from './types';

export const getCompositePrice: GetCompositePrice = async (
  params: GetCompositePriceParams,
): Promise<GetCompositePriceResponse> => {
  return await commandFrameClient.call<GetCompositePriceParams, GetCompositePriceResponse>('getCompositePrice', params);
};
