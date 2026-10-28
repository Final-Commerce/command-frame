import type { CFLoyaltyMember, CFLoyaltyOutcome } from '../../CommonTypes';

export interface ConfirmLoyaltyCheckParams {
  /** The 6-digit code the customer received. */
  code: string;
}

export interface ConfirmLoyaltyCheckResponse extends CFLoyaltyOutcome {
  /** Right code: the card it proved, now the member on this sale; null for someone not yet a member. Missing only when the host itself failed. */
  member?: CFLoyaltyMember | null;
  /** Not a member yet: joinLoyalty joins them with the phone or email the code proved. */
  canJoin?: boolean;
}

export type ConfirmLoyaltyCheck = (params: ConfirmLoyaltyCheckParams) => Promise<ConfirmLoyaltyCheckResponse>;
