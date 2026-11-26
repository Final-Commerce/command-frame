import { CFBooking } from '../../CommonTypes';

export interface HoldBookingParams {
  productId: string;
  /**
   * Which resource serves it: a member of staff, a room, a scooter. Omit for "any free one": the host picks the first
   * resource, in availability order, with `qty` places free for the whole window (or every session of a course).
   * A storefront still needs it.
   */
  resourceId?: string;
  /** Must be the START of a slot the host offered, ISO 8601. */
  startAt: string;
  /**
   * End of the window — the `endAt` of the slot you picked, or of the last slot in a stay. A window that cannot be
   * lined up with the grid is refused. Omit it only when you pass `periods`.
   */
  endAt?: string;
  /**
   * Instead of `endAt`, for date-range rules: how many periods from `startAt` — hours, nights, days, or whole weeks /
   * months. The host reads the end off its own grid and refuses what the rules refuse (`minStayLength` /
   * `maxStayLength` from `getBookingAvailability`, each with its own unit — "2 nights", "1 week" — and whole periods).
   * Pass exactly one of `endAt` and `periods`. A storefront still needs `endAt`.
   */
  periods?: number;
  /** The variant being sold, when the flow already knows which one. */
  variantId?: string;
  /** Whom the booking is for. Omit for a walk-in. */
  customerId?: string;
  /**
   * How many places of the resource this booking takes (seats in a class, spots in a session). A whole
   * number, default 1. Refused above the resource's capacity and above the rule's `maxQtyPerBooking`.
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

export interface HoldBookingResponse {
  /** False when the command was refused — a taken window, a rule, a booking that is not yours. */
  success: boolean;
  /** Why it was refused, in words a cashier can act on. Absent on success. */
  reason?: string;
  /** The claim. `expiresAt` says how long it survives unpaid; `id` is what you confirm or cancel. */
  booking?: CFBooking;
  /** A course: the id every session's hold shares, and how many sessions it holds. `booking` is the first session. */
  groupId?: string;
  sessions?: number;
  timestamp: string;
}

export type HoldBooking = (params: HoldBookingParams) => Promise<HoldBookingResponse>;
