import type { CFLoyaltyOutcome, CFLoyaltyState } from '../../CommonTypes';

export interface GetLoyaltyParams {
  /** Ask Engage again instead of answering from what the host already knows about this sale. */
  refresh?: boolean;
}

export interface GetLoyaltyResponse extends CFLoyaltyOutcome {
  /** Present on every answer the host gives, a refusal included (offline: what it last knew). Missing only when the host itself failed; `reason` says why. */
  loyalty?: CFLoyaltyState;
}

export type GetLoyalty = (params?: GetLoyaltyParams) => Promise<GetLoyaltyResponse>;
