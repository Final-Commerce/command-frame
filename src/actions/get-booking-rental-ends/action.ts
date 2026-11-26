/**
 * Get booking rental ends action
 * Calls the getBookingRentalEnds action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { GetBookingRentalEnds, GetBookingRentalEndsParams, GetBookingRentalEndsResponse } from './types';

export const getBookingRentalEnds: GetBookingRentalEnds = async (
  params: GetBookingRentalEndsParams,
): Promise<GetBookingRentalEndsResponse> => {
  return await commandFrameClient.call<GetBookingRentalEndsParams, GetBookingRentalEndsResponse>(
    'getBookingRentalEnds',
    params,
  );
};
