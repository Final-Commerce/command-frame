import { afterEach, describe, expect, it, vi } from 'vitest';
import { MOCK_BOOKINGS, MOCK_OUTLET_MAIN } from '../../demo/database';
import { mockGetBookings } from './mock';

vi.spyOn(console, 'log').mockImplementation(() => undefined);
const bookingsBefore = MOCK_BOOKINGS.length;
afterEach(() => {
  MOCK_BOOKINGS.splice(bookingsBefore);
});

describe('getBookings mock — outletId (FC-1459)', () => {
  it('lists only the bookings made at that outlet', async () => {
    MOCK_BOOKINGS.push({ ...MOCK_BOOKINGS[0], id: 'bk_harbour', outletId: 'outlet_harbour' });
    const { bookings } = await mockGetBookings({ outletId: 'outlet_harbour' });
    expect(bookings?.map(({ id }) => id)).toEqual(['bk_harbour']);
  });

  it('without outletId lists every outlet, as before', async () => {
    MOCK_BOOKINGS.push({ ...MOCK_BOOKINGS[0], id: 'bk_harbour', outletId: 'outlet_harbour' });
    const { bookings } = await mockGetBookings();
    expect(bookings).toHaveLength(bookingsBefore + 1);
    expect(bookings?.filter(({ outletId }) => outletId === MOCK_OUTLET_MAIN.id)).toHaveLength(bookingsBefore);
  });
});
