import { CFBookingStayEnd } from '../../CommonTypes';

// READ-ONLY query: the engine's own answer to "where can a stay from this start end", so a range calendar
// enables and highlights exactly what `addBookingToCart` would accept — and computes nothing itself.
// `addBookingToCart` re-checks at submit time: a window taken in between is refused with a reason.

export interface GetBookingStayEndsParams {
  /** The bookable product. Date-range rules only (hours, nights, days, weeks, months). */
  productId: string;
  /** The chosen check-in: the `startAt` of a slot `getBookingAvailability` offered, ISO 8601. */
  startAt: string;
  /**
   * Last shop day an end may fall on, `YYYY-MM-DD` (the format of `getBookingAvailability`'s `fromDay`). Ends past it are
   * not computed. Leave one page more than you show — a check-in on the last day, a whole week or month — and never a day
   * before the chosen check-out; ask again with a later day when the cashier pages or steps past it. The shortest allowed
   * stay comes even when it ends past it — alone — so a `minStay` longer than what you show still books.
   */
  untilDay: string;
  /** The resource that must serve the whole stay. Omit for "any free one", picked per end exactly as the hold picks it. */
  resourceId?: string;
  /** Places the booking takes, as you will pass to `addBookingToCart`. Default 1. */
  qty?: number;
}

export interface GetBookingStayEndsResponse {
  /** False when no stay can start here — a taken first night, a `minStay` the free nights do not reach, a non-range rule. */
  success: boolean;
  /** Why, in the host's own words. Absent on success. */
  reason?: string;
  /**
   * Every end the stay may have now, ascending, never empty on success. Enable only these as check-out; highlight the
   * chosen one's `coveredSlots`; send its `endAt` to `addBookingToCart`.
   */
  ends?: CFBookingStayEnd[];
  timestamp: string;
}

export type GetBookingStayEnds = (params: GetBookingStayEndsParams) => Promise<GetBookingStayEndsResponse>;
