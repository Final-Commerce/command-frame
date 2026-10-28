import type { CFLoyaltyMember, CFLoyaltyOutcome } from '../../CommonTypes';

/** One of them. */
export interface FindLoyaltyMemberParams {
  /** The nine digits on the card, typed or scanned off its barcode. */
  cardNumber?: string;
  phone?: string;
  email?: string;
}

export interface FindLoyaltyMemberResponse extends CFLoyaltyOutcome {
  /** Now the member on this sale; null when nobody has that card, number or email. */
  member: CFLoyaltyMember | null;
  canJoin: boolean;
}

export type FindLoyaltyMember = (params: FindLoyaltyMemberParams) => Promise<FindLoyaltyMemberResponse>;
