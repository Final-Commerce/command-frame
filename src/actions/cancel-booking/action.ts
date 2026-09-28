/**
 * Cancel booking action
 * Calls the cancelBooking action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { CancelBooking, CancelBookingParams, CancelBookingResponse } from './types';

export const cancelBooking: CancelBooking = async (params: CancelBookingParams): Promise<CancelBookingResponse> => {
  return await commandFrameClient.call<CancelBookingParams, CancelBookingResponse>('cancelBooking', params);
};
