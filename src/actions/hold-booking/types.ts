import { CFBooking } from '../../CommonTypes';

export interface HoldBookingParams {
  productId: string;
  /** Which resource serves it: a member of staff, a room, a scooter. */
  resourceId: string;
  /** Must be the START of a slot the host offered, ISO 8601. */
  startAt: string;
  /**
   * End of the window — the `endAt` of the slot you picked, or of the last slot in a stay.
   * Required: a window that cannot be lined up with the grid is refused, and the till
   * has no local copy of the rules to derive it from.
   */
  endAt: string;
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
