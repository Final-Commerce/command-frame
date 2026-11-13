import { CFBooking } from '../../CommonTypes';

export interface AddBookingToCartParams {
  /** The bookable product (`productType: 'booking'`). */
  productId: string;
  /**
   * Which resource serves it: a member of staff, a room, a scooter. Omit for "any free one": the host picks the first
   * resource, in availability order, with `qty` places free for the whole window (or every session of a course).
   * A storefront still needs it.
   */
  resourceId?: string;
  /** Must be the START of a slot getBookingAvailability offered, ISO 8601. */
  startAt: string;
  /** End of the window — the slot's own `endAt`, or the last slot's for a stay. Omit it only when you pass `periods`. */
  endAt?: string;
  /**
   * Instead of `endAt`, for date-range rules: how many periods from `startAt` — hours, nights, days, or whole weeks /
   * months. The host reads the end off its own grid and refuses what the rules refuse (`minStayLength` /
   * `maxStayLength` from `getBookingAvailability`, each with its own unit — "2 nights", "1 week" — and whole periods).
   * Pass exactly one of `endAt` and `periods`. A storefront still needs `endAt`.
   */
  periods?: number;
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
