import { CFBooking } from '../../CommonTypes';

export interface AddBookingToCartParams {
  /** The bookable product (`productType: 'booking'`). */
  productId: string;
  /** Which resource serves it: a member of staff, a room, a scooter. */
  resourceId: string;
  /** Must be the START of a slot getBookingAvailability offered, ISO 8601. */
  startAt: string;
  /** End of the window — the slot's own `endAt`, or the last slot's for a stay. */
  endAt: string;
  /** The variant being sold. Defaults to the product's only variant. */
  variantId?: string;
  /** Whom the booking is for. Omit for a walk-in. */
  customerId?: string;
}

export interface AddBookingToCartResponse {
  /** The claim the cart now stands on: `id` cancels or releases it, `expiresAt` is your clock. */
  booking: CFBooking;
  /** Identity of the reservation inside the cart and, later, the order. */
  reservationInternalId: string;
  timestamp: string;
}

export type AddBookingToCart = (params: AddBookingToCartParams) => Promise<AddBookingToCartResponse>;
