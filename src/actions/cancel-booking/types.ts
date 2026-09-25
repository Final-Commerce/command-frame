import { CFBooking } from '../../CommonTypes';

export interface CancelBookingParams {
  /** `id` of the booking returned by holdBooking or getBookings. */
  bookingId: string;
}

export interface CancelBookingResponse {
  booking: CFBooking;
  timestamp: string;
}

export type CancelBooking = (params: CancelBookingParams) => Promise<CancelBookingResponse>;
