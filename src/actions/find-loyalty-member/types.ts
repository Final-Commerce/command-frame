import type { CFLoyaltyMember, CFLoyaltyOutcome } from '../../CommonTypes';

/** One of them. */
export interface FindLoyaltyMemberParams {
  /** The nine digits on the card, typed or scanned off its barcode. */
  cardNumber?: string;
  phone?: string;
  email?: string;
  /**
   * Link the card to the customer on the sale. Only when the cashier said yes: a card found while
   * a customer is attached is never linked on its own (see `canLink`).
   */
  link?: boolean;
}

export interface FindLoyaltyMemberResponse extends CFLoyaltyOutcome {
  /** Now the member on this sale; null when nobody has that card, number or email. Missing only when the host itself failed. */
  member?: CFLoyaltyMember | null;
  canJoin?: boolean;
  /** The card isn't linked to anyone and the sale has a customer: ask the cashier, then find it again with `link: true`. */
  canLink?: boolean;
}

export type FindLoyaltyMember = (params: FindLoyaltyMemberParams) => Promise<FindLoyaltyMemberResponse>;
