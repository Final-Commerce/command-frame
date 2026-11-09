import type { CFLoyaltyApplied, CFLoyaltyOutcome } from '../../CommonTypes';

/** Exactly one of them. */
export interface ApplyLoyaltyRewardParams {
  /** A reward of the member on this sale (`available` on their card). */
  rewardId?: string;
  /** An offer on their card (`offers[].grantId`). */
  grantId?: string;
  /** A coupon code typed or scanned: from a campaign, a post, a printed voucher. Needs no member. */
  code?: string;
}

export interface ApplyLoyaltyRewardResponse extends CFLoyaltyOutcome {
  /** On the cart now, and in getLoyalty().loyalty.applied. */
  applied?: CFLoyaltyApplied;
}

export type ApplyLoyaltyReward = (params: ApplyLoyaltyRewardParams) => Promise<ApplyLoyaltyRewardResponse>;
