import type { CFLoyaltyMember, CFLoyaltyOffer } from '../../../../CommonTypes';
import type { TopicEvent } from '../../../types';

/**
 * The member on this sale changed: the cart's customer was looked up, a card was found, a code
 * proved one, someone joined, the balance moved, or the member left the sale (`member: null`).
 */
export interface LoyaltyMemberChangedPayload {
  member: CFLoyaltyMember | null;
  canJoin: boolean;
  /** Coupons waiting on the sale's customer when they have no card. */
  offers?: CFLoyaltyOffer[];
}

export type LoyaltyMemberChangedEvent = TopicEvent<LoyaltyMemberChangedPayload>;
