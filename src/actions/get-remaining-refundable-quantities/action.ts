/**
 * Get remaining refundable quantities action
 * Calls the getRemainingRefundableQuantities action on the parent window
 */

import { commandFrameClient } from '../../client';
import type {
  GetRemainingRefundableQuantities,
  GetRemainingRefundableQuantitiesParams,
  GetRemainingRefundableQuantitiesResponse,
} from './types';

export const getRemainingRefundableQuantities: GetRemainingRefundableQuantities = async (
  params?: GetRemainingRefundableQuantitiesParams,
): Promise<GetRemainingRefundableQuantitiesResponse> => {
  return await commandFrameClient.call<
    GetRemainingRefundableQuantitiesParams | undefined,
    GetRemainingRefundableQuantitiesResponse
  >('getRemainingRefundableQuantities', params);
};
