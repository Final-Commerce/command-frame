export * from './booking-created/types';
export * from './booking-updated/types';
export * from './booking-setup-changed/types';

import type { BookingCreatedPayload } from './booking-created/types';
import type { BookingUpdatedPayload } from './booking-updated/types';
import type { BookingSetupChangedPayload } from './booking-setup-changed/types';

export type BookingsEventPayload = BookingCreatedPayload | BookingUpdatedPayload | BookingSetupChangedPayload;

export type BookingsEventType = 'booking-created' | 'booking-updated' | 'booking-setup-changed';
