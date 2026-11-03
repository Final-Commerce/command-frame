/**
 * Remove loyalty reward action
 * Calls the removeLoyaltyReward action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { RemoveLoyaltyReward, RemoveLoyaltyRewardParams, RemoveLoyaltyRewardResponse } from './types';

export const removeLoyaltyReward: RemoveLoyaltyReward = async (
  params: RemoveLoyaltyRewardParams,
): Promise<RemoveLoyaltyRewardResponse> => {
  return await commandFrameClient.call<RemoveLoyaltyRewardParams, RemoveLoyaltyRewardResponse>(
    'removeLoyaltyReward',
    params,
  );
};
