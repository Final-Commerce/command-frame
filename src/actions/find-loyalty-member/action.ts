/**
 * Find loyalty member action
 * Calls the findLoyaltyMember action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { FindLoyaltyMember, FindLoyaltyMemberParams, FindLoyaltyMemberResponse } from './types';

export const findLoyaltyMember: FindLoyaltyMember = async (
  params: FindLoyaltyMemberParams,
): Promise<FindLoyaltyMemberResponse> => {
  return await commandFrameClient.call<FindLoyaltyMemberParams, FindLoyaltyMemberResponse>('findLoyaltyMember', params);
};
