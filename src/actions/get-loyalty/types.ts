import type { CFLoyaltyOutcome, CFLoyaltyState } from '../../CommonTypes';

export interface GetLoyaltyParams {
  /** Ask Engage again instead of answering from what the host already knows about this sale. */
  refresh?: boolean;
}

export interface GetLoyaltyResponse extends CFLoyaltyOutcome {
  /** Always present, also on a refusal (offline: what the host last knew). */
  loyalty: CFLoyaltyState;
}

export type GetLoyalty = (params?: GetLoyaltyParams) => Promise<GetLoyaltyResponse>;
