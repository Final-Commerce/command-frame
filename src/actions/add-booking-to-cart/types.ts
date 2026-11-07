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
  /**
   * How many places of the resource this booking takes (seats in a class, spots in a session). A whole
   * number, default 1. Each place is charged: the reservation's `quantity` counts them and its `total` is
   * `price × quantity`. Refused above the resource's capacity and above the rule's `maxQtyPerBooking`.
   * A window of several nights or days (a date range on a till) is charged per period too: `quantity = qty × periods`.
   */
  qty?: number;
  /**
   * How many people the booking is for (a room for 3, a table for 4). A whole number. Recorded on the booking; it takes
   * no extra places and does not change the price. Refused above the rule's `maxPartySize`. Omit when not asked.
   */
  partySize?: number;
  /**
   * Book the whole course (session rules sold as a course): one hold per session, all or nothing. Pass the course's own
   * `startAt` / `endAt` from `getBookingAvailability` (`availability.course`); other values are refused. Refused on rules
   * that do not sell a course; a course rule refuses a booking without it.
   */
  course?: boolean;
}

export interface AddBookingToCartResponse {
  /** False when the command was refused — a taken window, a rule, a booking that is not yours. */
  success: boolean;
  /** Why it was refused, in words a cashier can act on. Absent on success. */
  reason?: string;
  /** The claim the cart now stands on: `id` cancels or releases it, `expiresAt` is your clock. */
  booking?: CFBooking;
  /** Identity of the reservation inside the cart and, later, the order. */
  reservationInternalId?: string;
  timestamp: string;
}

export type AddBookingToCart = (params: AddBookingToCartParams) => Promise<AddBookingToCartResponse>;
