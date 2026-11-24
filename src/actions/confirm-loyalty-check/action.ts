/**
 * Confirm loyalty check action
 * Calls the confirmLoyaltyCheck action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { ConfirmLoyaltyCheck, ConfirmLoyaltyCheckParams, ConfirmLoyaltyCheckResponse } from './types';

export const confirmLoyaltyCheck: ConfirmLoyaltyCheck = async (
  params: ConfirmLoyaltyCheckParams,
): Promise<ConfirmLoyaltyCheckResponse> => {
  return await commandFrameClient.call<ConfirmLoyaltyCheckParams, ConfirmLoyaltyCheckResponse>(
    'confirmLoyaltyCheck',
    params,
  );
};
