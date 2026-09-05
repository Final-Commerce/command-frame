export * from './booking-created/types';
export * from './booking-updated/types';

import type { BookingCreatedPayload } from './booking-created/types';
import type { BookingUpdatedPayload } from './booking-updated/types';

export type BookingsEventPayload = BookingCreatedPayload | BookingUpdatedPayload;

export type BookingsEventType = 'booking-created' | 'booking-updated';
