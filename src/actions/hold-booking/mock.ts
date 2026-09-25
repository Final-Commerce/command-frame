import { HoldBooking, HoldBookingParams, HoldBookingResponse } from './types';
import { MOCK_BOOKINGS, MOCK_BOOKING_RESOURCES, mockLiveBookings } from '../../demo/database';
import { ReservationStatus } from '@final-commerce/common';

const BUFFER_MINUTES = 5;
const HOLD_MINUTES = 10;

export const mockHoldBooking: HoldBooking = async (params: HoldBookingParams): Promise<HoldBookingResponse> => {
  console.log('[Mock] holdBooking called', params);

  const startAt = new Date(params.startAt);
  const endAt = new Date(params.endAt);
  const bufferEndAt = new Date(endAt.getTime() + BUFFER_MINUTES * 60_000);

  // The mock refuses a taken window like the host does. A mock that always said yes would
  // let a booking screen ship without ever handling the one error it will actually meet.
  const clash = mockLiveBookings().some(
    (entry) =>
      entry.resourceId === params.resourceId &&
      new Date(entry.startAt) < bufferEndAt &&
      new Date(entry.bufferEndAt) > startAt,
  );
  if (clash) throw new Error('That window has just been taken — pick another slot.');

  const booking = {
    id: `bk_mock_${Date.now()}`,
    productId: params.productId,
    resourceId: params.resourceId,
    variantId: params.variantId,
    startAt: startAt.toISOString(),
    endAt: endAt.toISOString(),
    bufferEndAt: bufferEndAt.toISOString(),
    customerId: params.customerId,
    status: ReservationStatus.HELD,
    expiresAt: new Date(Date.now() + HOLD_MINUTES * 60_000).toISOString(),
    resourceName: MOCK_BOOKING_RESOURCES.find(({ id }) => id === params.resourceId)?.name,
  };

  // Held in the same list availability reads, so the slot really does disappear.
  MOCK_BOOKINGS.push(booking);
  return { booking, timestamp: new Date().toISOString() };
};
