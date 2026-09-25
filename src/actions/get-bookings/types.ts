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
  /** False when the command was refused — a taken window, a rule, a booking that is not yours. */
  success: boolean;
  /** Why it was refused, in words a cashier can act on. Absent on success. */
  reason?: string;
  bookings: CFBooking[];
  timestamp: string;
}

export type GetBookings = (params?: GetBookingsParams) => Promise<GetBookingsResponse>;
