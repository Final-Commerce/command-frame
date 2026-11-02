import { CancelBooking, CancelBookingParams, CancelBookingResponse } from './types';
import { MOCK_BOOKINGS, MOCK_CART, mockPublishEvent } from '../../demo/database';
import { ReservationStatus } from '@final-commerce/common';

export const mockCancelBooking: CancelBooking = async (params: CancelBookingParams): Promise<CancelBookingResponse> => {
  console.log('[Mock] cancelBooking called', params);
  const booking = MOCK_BOOKINGS.find(({ id }) => id === params.bookingId);
  if (!booking) {
    return { success: false, reason: `No booking ${params.bookingId}`, timestamp: new Date().toISOString() };
  }
  // A paid booking is not cancellable: the window would be freed while the money stays taken.
  if (booking.status === ReservationStatus.CONFIRMED && booking.orderId) {
    return {
      success: false,
      reason: `That booking is paid for on order ${booking.orderId} — refund the service instead`,
      timestamp: new Date().toISOString(),
    };
  }
  booking.status = ReservationStatus.CANCELLED;

  // A window given away may be the one an open cart is selling, so the cart follows — the host
  // does this, and a mock that left the line behind sold time that had just been released.
  const index = (MOCK_CART.reservations ?? []).findIndex((entry) => entry.bookingId === params.bookingId);
  if (index >= 0) {
    const [removed] = MOCK_CART.reservations!.splice(index, 1);
    const line = removed.total || removed.price * (removed.quantity ?? 1);
    MOCK_CART.subtotal -= line;
    MOCK_CART.total -= line;
    MOCK_CART.amountToBeCharged = MOCK_CART.total;
    MOCK_CART.remainingBalance = MOCK_CART.total;
    mockPublishEvent('cart', 'cart-created', { cart: MOCK_CART });
  }

  return { success: true, booking, timestamp: new Date().toISOString() };
};
