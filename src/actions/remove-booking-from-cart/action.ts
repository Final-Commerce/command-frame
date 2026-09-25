/**
 * Remove booking from cart action
 * Calls the removeBookingFromCart action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { RemoveBookingFromCart, RemoveBookingFromCartParams, RemoveBookingFromCartResponse } from './types';

export const removeBookingFromCart: RemoveBookingFromCart = async (
  params: RemoveBookingFromCartParams,
): Promise<RemoveBookingFromCartResponse> => {
  return await commandFrameClient.call<RemoveBookingFromCartParams, RemoveBookingFromCartResponse>(
    'removeBookingFromCart',
    params,
  );
};
