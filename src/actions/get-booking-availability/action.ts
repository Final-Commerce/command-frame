/**
 * Get booking availability action
 * Calls the getBookingAvailability action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { GetBookingAvailability, GetBookingAvailabilityParams, GetBookingAvailabilityResponse } from './types';

export const getBookingAvailability: GetBookingAvailability = async (
  params: GetBookingAvailabilityParams,
): Promise<GetBookingAvailabilityResponse> => {
  return await commandFrameClient.call<GetBookingAvailabilityParams, GetBookingAvailabilityResponse>(
    'getBookingAvailability',
    params,
  );
};
