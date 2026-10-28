import { ApplyLoyaltyReward, ApplyLoyaltyRewardParams, ApplyLoyaltyRewardResponse } from './types';
import {
  MOCK_LOYALTY_PROGRAM,
  mockApplyToCart,
  mockGiveBack,
  mockLoyaltyOutcome,
  mockLoyaltyRefusal,
  mockSaleMember,
  mockSpend,
} from '../../demo/loyalty';

export const mockApplyLoyaltyReward: ApplyLoyaltyReward = async (
  params: ApplyLoyaltyRewardParams,
): Promise<ApplyLoyaltyRewardResponse> => {
  console.log('[Mock] applyLoyaltyReward called', params);
  const given = [params?.rewardId, params?.grantId, params?.code].filter(Boolean).length;
  if (given !== 1) return mockLoyaltyRefusal('bad_request', 'Send one of rewardId, grantId or code.');
  const member = mockSaleMember();

  if (params.rewardId) {
    if (!member) return mockLoyaltyRefusal('check_needed', "There's no member on this sale.");
    const reward = MOCK_LOYALTY_PROGRAM.rewards.find((r) => r.id === params.rewardId);
    if (!reward) return mockLoyaltyRefusal('not_found', "That reward isn't in the programme any more.");
    if (!mockSpend(member.id, reward.cost))
      return mockLoyaltyRefusal(
        'unavailable',
        `${reward.name} takes ${reward.cost} stamps; they have ${member.balance}.`,
      );
    const applied = mockApplyToCart(reward.name, reward, { rewardId: reward.id, offerId: null });
    if (!('redemptionId' in applied)) {
      mockGiveBack(member.id, reward.cost);
      return applied;
    }
    return { ...mockLoyaltyOutcome(), applied };
  }

  const offer = params.grantId
    ? member?.offers.find((o) => o.grantId === params.grantId)
    : member?.offers.find((o) => o.code.toUpperCase() === params.code?.trim().toUpperCase());
  if (!offer)
    return mockLoyaltyRefusal(
      'not_found',
      params.grantId ? "That offer isn't on their card." : "That code isn't one this shop gave out.",
    );
  const applied = mockApplyToCart(offer.name, offer.discount, { rewardId: null, offerId: offer.offerId });
  return 'redemptionId' in applied ? { ...mockLoyaltyOutcome(), applied } : applied;
};
