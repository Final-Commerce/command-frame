import { MOCK_BOOKINGS } from '../../demo/database';
import { RemoveBookingFromCart, RemoveBookingFromCartParams, RemoveBookingFromCartResponse } from './types';

export const mockRemoveBookingFromCart: RemoveBookingFromCart = async (
  params: RemoveBookingFromCartParams,
): Promise<RemoveBookingFromCartResponse> => {
  console.log('[Mock] removeBookingFromCart called', params);
  // The hold has to go back, or the mock is a trap: `addBookingToCart` pushes into the very list
  // availability reads, so add → remove → add the same slot used to refuse forever with "that
  // window has just been taken". The reservation id the mock hands out is `res_<booking.id>`,
  // which is the only link back to the row.
  const bookingId = params.reservationInternalId.replace(/^res_/, '');
  const index = MOCK_BOOKINGS.findIndex(({ id }) => id === bookingId);
  const [released] = index >= 0 ? MOCK_BOOKINGS.splice(index, 1) : [];
  return {
    reservationInternalId: params.reservationInternalId,
    booking: released,
    timestamp: new Date().toISOString(),
  };
};
