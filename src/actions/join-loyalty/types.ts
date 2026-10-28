import type { CFLoyaltyMember, CFLoyaltyOutcome } from '../../CommonTypes';

export interface JoinLoyaltyParams {
  name?: string;
  /** Staff mode only, when the sale has no customer with one. A customer joins with what their code proved. */
  email?: string;
  phone?: string;
}

export interface JoinLoyaltyResponse extends CFLoyaltyOutcome {
  /** Now the member on this sale. */
  member: CFLoyaltyMember | null;
  /** False when they were a member already. */
  created: boolean;
}

export type JoinLoyalty = (params?: JoinLoyaltyParams) => Promise<JoinLoyaltyResponse>;
