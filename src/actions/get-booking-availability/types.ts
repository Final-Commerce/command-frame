import { CFBookingAvailability } from '../../CommonTypes';

export interface GetBookingAvailabilityParams {
  /** The bookable product (`productType: 'booking'`) whose calendar you are drawing. */
  productId: string;
  /** Range start, ISO 8601. */
  from: string;
  /** Range end, ISO 8601. */
  to: string;
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
