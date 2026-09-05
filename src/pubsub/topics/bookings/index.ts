import type { TopicDefinition } from '../../types';

export const bookingsTopic: TopicDefinition = {
  id: 'bookings',
  name: 'Bookings',
  description:
    'Topic for bookings synced from the database. A booking IS the occupancy, so this is the ' +
    'signal that somebody else took (or freed) a window: re-ask getBookingAvailability when it ' +
    'fires instead of polling the server on a timer.',
  eventTypes: [
    {
      id: 'booking-created',
      name: 'Booking Created',
      description: 'Published when a booking made elsewhere — another till, the back office — is synced in',
    },
    {
      id: 'booking-updated',
      name: 'Booking Updated',
      description: 'Published when a synced booking changes: confirmed after payment, cancelled, or expired',
    },
  ],
};

export * from './types';
