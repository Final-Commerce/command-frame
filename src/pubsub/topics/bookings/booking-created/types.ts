import type { CFBooking } from '../../../../CommonTypes';
import type { TopicEvent } from '../../../types';

export interface BookingCreatedPayload {
  booking: CFBooking;
}

export type BookingCreatedEvent = TopicEvent<BookingCreatedPayload>;
