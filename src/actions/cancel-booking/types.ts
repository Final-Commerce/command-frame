import { CFBooking } from '../../CommonTypes';

export interface CancelBookingParams {
  /** `id` of the booking returned by holdBooking or getBookings. */
  bookingId: string;
}

export interface CancelBookingResponse {
  /** False when the command was refused — a taken window, a rule, a booking that is not yours. */
  success: boolean;
  /** Why it was refused, in words a cashier can act on. Absent on success. */
  reason?: string;
  booking?: CFBooking;
  timestamp: string;
}

export type CancelBooking = (params: CancelBookingParams) => Promise<CancelBookingResponse>;
