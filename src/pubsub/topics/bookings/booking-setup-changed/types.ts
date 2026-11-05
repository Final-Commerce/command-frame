import type { TopicEvent } from '../../../types';

/**
 * What a booking can be MADE of changed — a rule set, a resource, who serves a product, or where
 * a resource works. Occupancy is untouched.
 *
 * Deliberately carries no row: the change can span several collections at once (a rule set edited
 * AND a product↔resource link removed), and a subscriber cannot act on a partial picture anyway.
 * The only correct reaction is to re-ask `getBookingResources` and `getBookingAvailability`,
 * because both previous answers were computed from the old setup.
 */
export interface BookingSetupChangedPayload {
  /** Which collection moved, when the host knows: `booking-rules`, `booking-resources`, … */
  collection?: string;
}

export type BookingSetupChangedEvent = TopicEvent<BookingSetupChangedPayload>;
