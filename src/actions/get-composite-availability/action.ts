/**
 * Get composite availability action (read-only, B41)
 * Calls the getCompositeAvailability action on the parent window
 */

import { commandFrameClient } from '../../client';
import type {
  GetCompositeAvailability,
  GetCompositeAvailabilityParams,
  GetCompositeAvailabilityResponse,
} from './types';

export const getCompositeAvailability: GetCompositeAvailability = async (
  params: GetCompositeAvailabilityParams,
): Promise<GetCompositeAvailabilityResponse> => {
  return await commandFrameClient.call<GetCompositeAvailabilityParams, GetCompositeAvailabilityResponse>(
    'getCompositeAvailability',
    params,
  );
};
