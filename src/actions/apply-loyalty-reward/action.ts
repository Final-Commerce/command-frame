/**
 * Apply loyalty reward action
 * Calls the applyLoyaltyReward action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { ApplyLoyaltyReward, ApplyLoyaltyRewardParams, ApplyLoyaltyRewardResponse } from './types';

export const applyLoyaltyReward: ApplyLoyaltyReward = async (
  params: ApplyLoyaltyRewardParams,
): Promise<ApplyLoyaltyRewardResponse> => {
  return await commandFrameClient.call<ApplyLoyaltyRewardParams, ApplyLoyaltyRewardResponse>(
    'applyLoyaltyReward',
    params,
  );
};
