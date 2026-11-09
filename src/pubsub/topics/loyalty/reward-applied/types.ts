import type { CFLoyaltyApplied } from '../../../../CommonTypes';
import type { TopicEvent } from '../../../types';

/** A reward, an offer or a coupon code is on the cart now (its discount went on with it). */
export interface LoyaltyRewardAppliedPayload {
  applied: CFLoyaltyApplied;
}

export type LoyaltyRewardAppliedEvent = TopicEvent<LoyaltyRewardAppliedPayload>;
