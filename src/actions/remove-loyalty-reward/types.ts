import type { CFLoyaltyOutcome } from '../../CommonTypes';

export interface RemoveLoyaltyRewardParams {
  /** `applied.redemptionId`. */
  redemptionId: string;
}

export type RemoveLoyaltyRewardResponse = CFLoyaltyOutcome;

export type RemoveLoyaltyReward = (params: RemoveLoyaltyRewardParams) => Promise<RemoveLoyaltyRewardResponse>;
