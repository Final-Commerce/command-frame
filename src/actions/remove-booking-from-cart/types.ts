import { CFBooking } from '../../CommonTypes';

export interface RemoveBookingFromCartParams {
  /** The reservation's own id, as `addBookingToCart` returned it. */
  reservationInternalId: string;
}

export interface RemoveBookingFromCartResponse {
  reservationInternalId: string;
  /** The released hold, so the caller can see it is no longer held. */
  booking?: CFBooking;
  timestamp: string;
}

export type RemoveBookingFromCart = (params: RemoveBookingFromCartParams) => Promise<RemoveBookingFromCartResponse>;
