import { HoldBooking, HoldBookingParams, HoldBookingResponse } from './types';
import { MOCK_BOOKINGS, MOCK_BOOKING_RESOURCES, mockBookingAvailability, mockLiveBookings } from '../../demo/database';
import { ReservationStatus, pickFreeResource } from '@final-commerce/common';

const BUFFER_MINUTES = 5;
const HOLD_MINUTES = 10;
const TAKEN = 'That window has just been taken — pick another slot.';
const MOCK_ONLY_SINGLE_SLOTS = "[Mock] the mock shop sells single 30-minute slots — pass the slot's endAt";

let held = 0;

const refused = (reason: string): HoldBookingResponse => ({
  success: false,
  reason,
  timestamp: new Date().toISOString(),
});

const offeredSlot = (productId: string, startAt: string) =>
  mockBookingAvailability(productId, new Date(startAt), new Date(Date.parse(startAt) + 60_000)).slots.find(
    (slot) => slot.startAt === new Date(startAt).toISOString(),
  );

// The mock refuses a taken window like the host does. A mock that always said yes would
// let a booking screen ship without ever handling the one error it will actually meet.
const windowIsTaken = (resourceId: string, startAt: Date, bufferEndAt: Date) =>
  mockLiveBookings().some(
    (entry) =>
      entry.resourceId === resourceId && new Date(entry.startAt) < bufferEndAt && new Date(entry.bufferEndAt) > startAt,
  );

export const mockHoldBooking: HoldBooking = async (params: HoldBookingParams): Promise<HoldBookingResponse> => {
  console.log('[Mock] holdBooking called', params);
  if (params.course || (params.periods !== undefined && params.periods !== 1)) return refused(MOCK_ONLY_SINGLE_SLOTS);
  const slot = offeredSlot(params.productId, params.startAt);
  const resourceId = params.resourceId ?? (slot && pickFreeResource(slot, params.qty)?.resourceId);
  const end = params.endAt ?? slot?.endAt;
  if (!resourceId || !end) return refused(TAKEN);
  const startAt = new Date(params.startAt);
  const endAt = new Date(end);
  const bufferEndAt = new Date(endAt.getTime() + BUFFER_MINUTES * 60_000);
  if (windowIsTaken(resourceId, startAt, bufferEndAt)) return refused(TAKEN);

  const booking = {
    // A counter, not a clock: two holds in the same millisecond used to share an id, and cancel
    // or remove then acted on the wrong row. Scripted tests hit that routinely.
    id: `bk_mock_${(held += 1)}`,
    productId: params.productId,
    resourceId,
    variantId: params.variantId,
    startAt: startAt.toISOString(),
    endAt: endAt.toISOString(),
    bufferEndAt: bufferEndAt.toISOString(),
    customerId: params.customerId,
    qty: params.qty,
    partySize: params.partySize,
    status: ReservationStatus.HELD,
    expiresAt: new Date(Date.now() + HOLD_MINUTES * 60_000).toISOString(),
    resourceName: MOCK_BOOKING_RESOURCES.find(({ id }) => id === resourceId)?.name,
  };

  // Held in the same list availability reads, so the slot really does disappear.
  MOCK_BOOKINGS.push(booking);
  return { success: true, booking, timestamp: new Date().toISOString() };
};
