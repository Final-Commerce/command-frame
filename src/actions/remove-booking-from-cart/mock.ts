import { RemoveBookingFromCart, RemoveBookingFromCartParams, RemoveBookingFromCartResponse } from './types';

export const mockRemoveBookingFromCart: RemoveBookingFromCart = async (
  params: RemoveBookingFromCartParams,
): Promise<RemoveBookingFromCartResponse> => {
  console.log('[Mock] removeBookingFromCart called', params);
  // The mock cart holds no reservations (see addBookingToCart's mock), so there is nothing to
  // take out and no hold to release — the shape of the answer is what a cart screen needs.
  return { reservationInternalId: params.reservationInternalId, timestamp: new Date().toISOString() };
};
