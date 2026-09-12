import { MOCK_BOOKINGS, MOCK_CART, mockPublishEvent } from '../../demo/database';
import { RemoveBookingFromCart, RemoveBookingFromCartParams, RemoveBookingFromCartResponse } from './types';

export const mockRemoveBookingFromCart: RemoveBookingFromCart = async (
  params: RemoveBookingFromCartParams,
): Promise<RemoveBookingFromCartResponse> => {
  console.log('[Mock] removeBookingFromCart called', params);

  const reservations = MOCK_CART.reservations ?? [];
  const cartIndex = reservations.findIndex(({ internalId }) => internalId === params.reservationInternalId);
  const [removed] = cartIndex >= 0 ? reservations.splice(cartIndex, 1) : [];

  if (removed) {
    const line = removed.total || removed.price * (removed.quantity ?? 1);
    MOCK_CART.subtotal -= line;
    MOCK_CART.total -= line;
    MOCK_CART.amountToBeCharged = MOCK_CART.total;
    MOCK_CART.remainingBalance = MOCK_CART.total;
    mockPublishEvent('cart', 'reservation-removed', { reservation: removed });
  }

  // The hold has to go back, or the mock is a trap: `addBookingToCart` pushes into the very list
  // availability reads, so add → remove → add the same slot used to refuse forever with "that
  // window has just been taken". The reservation id is `res_<booking.id>`, the link back to the row.
  const bookingId = removed?.bookingId ?? params.reservationInternalId.replace(/^res_/, '');
  const index = MOCK_BOOKINGS.findIndex(({ id }) => id === bookingId);
  const [released] = index >= 0 ? MOCK_BOOKINGS.splice(index, 1) : [];

  return {
    reservationInternalId: params.reservationInternalId,
    booking: released,
    timestamp: new Date().toISOString(),
  };
};
