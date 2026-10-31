/**
 * Start loyalty check action
 * Calls the startLoyaltyCheck action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { StartLoyaltyCheck, StartLoyaltyCheckParams, StartLoyaltyCheckResponse } from './types';

export const startLoyaltyCheck: StartLoyaltyCheck = async (
  params: StartLoyaltyCheckParams,
): Promise<StartLoyaltyCheckResponse> => {
  return await commandFrameClient.call<StartLoyaltyCheckParams, StartLoyaltyCheckResponse>('startLoyaltyCheck', params);
};
