import type { CFBooking } from '../../../../CommonTypes';
import type { TopicEvent } from '../../../types';

export interface BookingUpdatedPayload {
  booking: CFBooking;
}

export type BookingUpdatedEvent = TopicEvent<BookingUpdatedPayload>;
