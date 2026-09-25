import { CFBookingAvailability } from '../../CommonTypes';

export interface GetBookingAvailabilityParams {
  /** The bookable product (`productType: 'booking'`) whose calendar you are drawing. */
  productId: string;
  /**
   * Range start, ISO 8601. Optional when `fromDay` is given.
   *
   * Prefer `fromDay`: a calendar asks about DAYS, and turning "this day at this shop" into two
   * instants needs the shop's zone — which the host has and the caller has to go and find. A
   * caller that widened the range by a day at each end and filtered the answer afterwards was
   * working around the absence of `fromDay`.
   */
  from?: string;
  /** Range end, ISO 8601. Optional when `fromDay` is given. */
  to?: string;
  /**
   * First shop day to cover, `YYYY-MM-DD`. Resolved to local midnight in the shop's own zone,
   * so a day that is 23 or 25 hours long because the clocks moved is still exactly one day.
   * Omit both this and `from`/`to` to get today at the shop.
   */
  fromDay?: string;
  /** How many shop days from `fromDay`. Default 1. */
  days?: number;
  /** Narrow the answer to one resource — "only Marco", "only room 4". */
  resourceId?: string;
  /** Narrow to the resources standing at one outlet. */
  outletId?: string;
}

export interface GetBookingAvailabilityResponse {
  availability: CFBookingAvailability;
  timestamp: string;
}

export type GetBookingAvailability = (params: GetBookingAvailabilityParams) => Promise<GetBookingAvailabilityResponse>;
