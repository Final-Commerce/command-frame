import { afterEach, describe, expect, it, vi } from 'vitest';
import { MOCK_BOOKINGS, MOCK_PRODUCT_HAIRCUT, mockBookingAvailability, resetMockCart } from '../../demo/database';
import { mockHoldBooking } from './mock';
import { mockAddBookingToCart } from '../add-booking-to-cart/mock';

// FT-289 B1: qty / partySize are refused like the kaching host, with its texts.
vi.spyOn(console, 'log').mockImplementation(() => undefined);
const bookingsBefore = MOCK_BOOKINGS.length;
afterEach(() => {
  MOCK_BOOKINGS.splice(bookingsBefore);
  resetMockCart();
});

const freeSlot = () => {
  const slot = mockBookingAvailability(
    MOCK_PRODUCT_HAIRCUT._id!,
    new Date(),
    new Date(Date.now() + 7 * 864e5),
  ).slots.find((entry) => entry.resources[0].free > 0)!;
  return {
    productId: MOCK_PRODUCT_HAIRCUT._id!,
    resourceId: slot.resources[0].resourceId,
    startAt: slot.startAt,
    endAt: slot.endAt,
  };
};

describe('holdBooking mock — qty and partySize', () => {
  it('holds without either, as before', async () => {
    expect((await mockHoldBooking(freeSlot())).success).toBe(true);
  });

  it.each([0, 1.5])('refuses qty %s', async (qty) => {
    expect(await mockHoldBooking({ ...freeSlot(), qty })).toMatchObject({
      success: false,
      reason: 'qty must be a whole number of at least 1',
    });
  });

  it('refuses more places than a mock room holds', async () => {
    expect(await mockHoldBooking({ ...freeSlot(), qty: 2 })).toMatchObject({
      success: false,
      reason: expect.stringMatching(/^"Room \d" holds 1, 2 were asked for$/),
    });
  });

  it('accepts a party size and refuses a bad one', async () => {
    expect((await mockHoldBooking({ ...freeSlot(), partySize: 3 })).success).toBe(true);
    expect(await mockHoldBooking({ ...freeSlot(), partySize: 0 })).toMatchObject({
      success: false,
      reason: 'partySize must be a whole number of at least 1',
    });
  });

  it('refuses a course: the mock shop sells slots, as the host refuses on such rules', async () => {
    expect(await mockHoldBooking({ ...freeSlot(), course: true })).toMatchObject({
      success: false,
      reason: 'These rules do not sell a course',
    });
  });

  it('without resourceId holds the first free room, like the host (common pickFreeResource)', async () => {
    const result = await mockHoldBooking({ ...freeSlot(), resourceId: undefined });
    expect(result.success).toBe(true);
    expect(result.booking?.resourceId).toMatch(/^res_room_/);
  });

  it('periods: 1 ends at the slot; more is refused with the host text; endAt and periods together are refused', async () => {
    const { endAt, ...start } = freeSlot();
    expect((await mockHoldBooking({ ...start, periods: 1 })).booking?.endAt).toBe(new Date(endAt).toISOString());
    expect(await mockHoldBooking({ ...start, periods: 2 })).toMatchObject({
      success: false,
      reason: 'A booking covers one period; that window covers 2. Book them one at a time.',
    });
    expect(await mockHoldBooking({ ...start, endAt, periods: 1 })).toMatchObject({
      success: false,
      reason: 'Pass either endAt or periods',
    });
  });

  it('addBookingToCart passes the refusal through and adds nothing', async () => {
    const result = await mockAddBookingToCart({ ...freeSlot(), qty: 2 });
    expect(result.success).toBe(false);
    expect(MOCK_BOOKINGS.length).toBe(bookingsBefore);
  });
});
