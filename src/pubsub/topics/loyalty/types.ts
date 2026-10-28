export * from './member-changed/types';
export * from './reward-applied/types';
export * from './reward-removed/types';

import type { LoyaltyMemberChangedPayload } from './member-changed/types';
import type { LoyaltyRewardAppliedPayload } from './reward-applied/types';
import type { LoyaltyRewardRemovedPayload } from './reward-removed/types';

export type LoyaltyEventPayload =
  | LoyaltyMemberChangedPayload
  | LoyaltyRewardAppliedPayload
  | LoyaltyRewardRemovedPayload;

export type LoyaltyEventType = 'member-changed' | 'reward-applied' | 'reward-removed';
