import { afterEach, describe, expect, it, vi } from 'vitest';
import { pickFreeResource } from '@final-commerce/common';
import {
  MOCK_BOOKINGS,
  MOCK_CART,
  MOCK_PRODUCT_HAIRCUT,
  mockBookingAvailability,
  resetMockCart,
} from '../../demo/database';
import { mockHoldBooking } from './mock';
import { mockAddBookingToCart } from '../add-booking-to-cart/mock';

const TAKEN = 'That window has just been taken — pick another slot.';

vi.spyOn(console, 'log').mockImplementation(() => undefined);
const bookingsBefore = MOCK_BOOKINGS.length;
afterEach(() => {
  MOCK_BOOKINGS.splice(bookingsBefore);
  resetMockCart();
});

const offeredSlot = () =>
  mockBookingAvailability(MOCK_PRODUCT_HAIRCUT._id!, new Date(), new Date(Date.now() + 7 * 864e5)).slots.find(
    (entry) => entry.resources[0].free > 0,
  )!;

const freeSlot = () => {
  const slot = offeredSlot();
  return {
    productId: MOCK_PRODUCT_HAIRCUT._id!,
    resourceId: slot.resources[0].resourceId,
    startAt: slot.startAt,
    endAt: slot.endAt,
  };
};

describe('holdBooking mock', () => {
  it('holds without qty or partySize, as before', async () => {
    const params = freeSlot();
    const result = await mockHoldBooking(params);
    expect(result.success).toBe(true);
    expect(MOCK_BOOKINGS.length).toBe(bookingsBefore + 1);
    expect(result.booking?.resourceId).toBe(params.resourceId);
  });

  it('records qty and partySize as given — the host checks them, not the mock', async () => {
    const result = await mockHoldBooking({ ...freeSlot(), qty: 3, partySize: 4 });
    expect(result.booking).toMatchObject({ qty: 3, partySize: 4 });
  });

  it('without resourceId holds the resource common pickFreeResource picks', async () => {
    const slot = offeredSlot();
    const result = await mockHoldBooking({ ...freeSlot(), resourceId: undefined });
    expect(result.booking?.resourceId).toBe(pickFreeResource(slot)!.resourceId);
  });

  it('periods: 1 ends at the slot', async () => {
    const { endAt, ...start } = freeSlot();
    expect((await mockHoldBooking({ ...start, periods: 1 })).booking?.endAt).toBe(new Date(endAt).toISOString());
  });

  it('refuses a window already held', async () => {
    const params = freeSlot();
    await mockHoldBooking(params);
    expect(await mockHoldBooking(params)).toMatchObject({ success: false, reason: TAKEN });
    expect(MOCK_BOOKINGS.length).toBe(bookingsBefore + 1);
  });

  it.each([{ periods: 2 }, { course: true }])('refuses %o as a mock limit, not a host rule', async (extra) => {
    const result = await mockHoldBooking({ ...freeSlot(), ...extra });
    expect(result.success).toBe(false);
    expect(result.reason).toMatch(/^\[Mock\] /);
  });

  it('addBookingToCart passes the refusal through and adds nothing', async () => {
    const params = freeSlot();
    await mockHoldBooking(params);
    expect(await mockAddBookingToCart(params)).toMatchObject({ success: false, reason: TAKEN });
    expect(MOCK_BOOKINGS.length).toBe(bookingsBefore + 1);
    expect(MOCK_CART.reservations ?? []).toHaveLength(0);
  });
});
