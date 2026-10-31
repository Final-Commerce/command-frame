/**
 * Join loyalty action
 * Calls the joinLoyalty action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { JoinLoyalty, JoinLoyaltyParams, JoinLoyaltyResponse } from './types';

export const joinLoyalty: JoinLoyalty = async (params?: JoinLoyaltyParams): Promise<JoinLoyaltyResponse> => {
  return await commandFrameClient.call<JoinLoyaltyParams | undefined, JoinLoyaltyResponse>('joinLoyalty', params);
};
