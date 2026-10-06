/**
 * Hold booking action
 * Calls the holdBooking action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { HoldBooking, HoldBookingParams, HoldBookingResponse } from './types';

export const holdBooking: HoldBooking = async (params: HoldBookingParams): Promise<HoldBookingResponse> => {
  return await commandFrameClient.call<HoldBookingParams, HoldBookingResponse>('holdBooking', params);
};
