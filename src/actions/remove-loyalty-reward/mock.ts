import { RemoveLoyaltyReward, RemoveLoyaltyRewardParams, RemoveLoyaltyRewardResponse } from './types';
import {
  MOCK_LOYALTY,
  MOCK_LOYALTY_PROGRAM,
  mockGiveBack,
  mockLoyaltyOutcome,
  mockLoyaltyRefusal,
  mockRemoveFromCart,
  mockSaleMember,
} from '../../demo/loyalty';

export const mockRemoveLoyaltyReward: RemoveLoyaltyReward = async (
  params: RemoveLoyaltyRewardParams,
): Promise<RemoveLoyaltyRewardResponse> => {
  console.log('[Mock] removeLoyaltyReward called', params);
  const applied = MOCK_LOYALTY.applied.find((a) => a.redemptionId === params?.redemptionId);
  if (!applied) return mockLoyaltyRefusal('not_found', "That reward isn't on this cart.");
  mockRemoveFromCart(applied);
  const cost = MOCK_LOYALTY_PROGRAM.rewards.find((r) => r.id === applied.rewardId)?.cost ?? 0;
  if (cost) mockGiveBack(mockSaleMember()?.id ?? null, cost);
  return mockLoyaltyOutcome();
};
