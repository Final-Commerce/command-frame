import { HoldBooking, HoldBookingParams, HoldBookingResponse } from './types';
import { MOCK_BOOKINGS, MOCK_BOOKING_RESOURCES, mockBookingAvailability, mockLiveBookings } from '../../demo/database';
import { ReservationStatus, pickFreeResource } from '@final-commerce/common';

const BUFFER_MINUTES = 5;
const HOLD_MINUTES = 10;

let held = 0;

export const mockHoldBooking: HoldBooking = async (params: HoldBookingParams): Promise<HoldBookingResponse> => {
  console.log('[Mock] holdBooking called', params);

  // Same refusals and texts as the host (kaching `holdLocally`); every mock room holds one.
  const qty = params.qty ?? 1;
  if (!Number.isInteger(qty) || qty < 1) {
    return { success: false, reason: 'qty must be a whole number of at least 1', timestamp: new Date().toISOString() };
  }
  if (params.partySize !== undefined && (!Number.isInteger(params.partySize) || params.partySize < 1)) {
    return {
      success: false,
      reason: 'partySize must be a whole number of at least 1',
      timestamp: new Date().toISOString(),
    };
  }
  // The mock shop sells 30-minute slots, not a course: the host refuses `course` on such rules with this text.
  if (params.course) {
    return { success: false, reason: 'These rules do not sell a course', timestamp: new Date().toISOString() };
  }
  // "Any free resource" and "N periods", decided the host's way: common's `pickFreeResource` over the mock's own
  // availability; the mock shop sells single 30-minute slots, so only one period fits (the host's text otherwise).
  if ((params.endAt === undefined) === (params.periods === undefined)) {
    return { success: false, reason: 'Pass either endAt or periods', timestamp: new Date().toISOString() };
  }
  if (params.periods !== undefined && params.periods !== 1) {
    return {
      success: false,
      reason: `A booking covers one period; that window covers ${params.periods}. Book them one at a time.`,
      timestamp: new Date().toISOString(),
    };
  }
  const offered = mockBookingAvailability(
    params.productId,
    new Date(params.startAt),
    new Date(Date.parse(params.startAt) + 60_000),
  ).slots.find((slot) => slot.startAt === new Date(params.startAt).toISOString());
  const resourceId = params.resourceId ?? (offered && pickFreeResource(offered, qty)?.resourceId);
  if (!resourceId) {
    return { success: false, reason: 'No resource is free for that whole time', timestamp: new Date().toISOString() };
  }
  const windowEnd = params.endAt ?? offered?.endAt;
  if (!windowEnd) {
    return {
      success: false,
      reason: `${new Date(params.startAt).toISOString()} is not a bookable slot start for these rules`,
      timestamp: new Date().toISOString(),
    };
  }
  const resourceName = MOCK_BOOKING_RESOURCES.find(({ id }) => id === resourceId)?.name;
  if (qty > 1) {
    return {
      success: false,
      reason: `"${resourceName}" holds 1, ${qty} were asked for`,
      timestamp: new Date().toISOString(),
    };
  }

  const startAt = new Date(params.startAt);
  const endAt = new Date(windowEnd);
  const bufferEndAt = new Date(endAt.getTime() + BUFFER_MINUTES * 60_000);

  // The mock refuses a taken window like the host does. A mock that always said yes would
  // let a booking screen ship without ever handling the one error it will actually meet.
  const clash = mockLiveBookings().some(
    (entry) =>
      entry.resourceId === resourceId && new Date(entry.startAt) < bufferEndAt && new Date(entry.bufferEndAt) > startAt,
  );
  if (clash) {
    return {
      success: false,
      reason: 'That window has just been taken — pick another slot.',
      timestamp: new Date().toISOString(),
    };
  }

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
    status: ReservationStatus.HELD,
    expiresAt: new Date(Date.now() + HOLD_MINUTES * 60_000).toISOString(),
    resourceName,
  };

  // Held in the same list availability reads, so the slot really does disappear.
  MOCK_BOOKINGS.push(booking);
  return { success: true, booking, timestamp: new Date().toISOString() };
};
