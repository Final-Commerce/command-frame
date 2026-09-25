/**
 * Get bookings action
 * Calls the getBookings action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { GetBookings, GetBookingsParams, GetBookingsResponse } from './types';

export const getBookings: GetBookings = async (params?: GetBookingsParams): Promise<GetBookingsResponse> => {
  return await commandFrameClient.call<GetBookingsParams, GetBookingsResponse>('getBookings', params);
};
