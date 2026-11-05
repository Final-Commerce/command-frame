import { CFBooking } from '../../CommonTypes';

export interface RemoveBookingFromCartParams {
  /** The reservation's own id, as `addBookingToCart` returned it. */
  reservationInternalId: string;
}

export interface RemoveBookingFromCartResponse {
  /** False when the command was refused — a taken window, a rule, a booking that is not yours. */
  success: boolean;
  /** Why it was refused, in words a cashier can act on. Absent on success. */
  reason?: string;
  reservationInternalId?: string;
  /** The released hold, so the caller can see it is no longer held. */
  booking?: CFBooking;
  timestamp: string;
}

export type RemoveBookingFromCart = (params: RemoveBookingFromCartParams) => Promise<RemoveBookingFromCartResponse>;
