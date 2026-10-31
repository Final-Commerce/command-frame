/**
 * Get loyalty action
 * Calls the getLoyalty action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { GetLoyalty, GetLoyaltyParams, GetLoyaltyResponse } from './types';

export const getLoyalty: GetLoyalty = async (params?: GetLoyaltyParams): Promise<GetLoyaltyResponse> => {
  return await commandFrameClient.call<GetLoyaltyParams | undefined, GetLoyaltyResponse>('getLoyalty', params);
};
