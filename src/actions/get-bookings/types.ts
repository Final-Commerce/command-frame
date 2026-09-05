import { CFBooking } from '../../CommonTypes';

export interface GetBookingsParams {
  /** Everything taking this resource's time — the one query a day view needs. */
  resourceId?: string;
  productId?: string;
  /** This customer's appointments. */
  customerId?: string;
  /** Bookings whose window overlaps this range, ISO 8601. */
  from?: string;
  to?: string;
  /** Defaults to live bookings only (confirmed, plus holds that have not expired). */
  includeExpired?: boolean;
}

export interface GetBookingsResponse {
  bookings: CFBooking[];
  timestamp: string;
}

export type GetBookings = (params?: GetBookingsParams) => Promise<GetBookingsResponse>;
