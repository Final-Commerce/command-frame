import { CancelBooking, CancelBookingParams, CancelBookingResponse } from './types';
import { MOCK_BOOKINGS } from '../../demo/database';
import { ReservationStatus } from '@final-commerce/common';

export const mockCancelBooking: CancelBooking = async (params: CancelBookingParams): Promise<CancelBookingResponse> => {
  console.log('[Mock] cancelBooking called', params);
  const booking = MOCK_BOOKINGS.find(({ id }) => id === params.bookingId);
  if (!booking) throw new Error(`No booking ${params.bookingId}`);
  booking.status = ReservationStatus.CANCELLED;
  return { booking, timestamp: new Date().toISOString() };
};
