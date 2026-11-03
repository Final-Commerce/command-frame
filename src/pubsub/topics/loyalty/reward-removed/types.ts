import type { TopicEvent } from '../../../types';

/**
 * A reward or an offer came off the cart and its stamps or points went back: `removed` by
 * removeLoyaltyReward, `cart-changed` when its discount or line went, `member-left` when the member
 * left the sale, `cleared` when the cart was emptied without a sale.
 */
export interface LoyaltyRewardRemovedPayload {
  redemptionId: string;
  why: 'removed' | 'cart-changed' | 'member-left' | 'cleared';
}

export type LoyaltyRewardRemovedEvent = TopicEvent<LoyaltyRewardRemovedPayload>;
