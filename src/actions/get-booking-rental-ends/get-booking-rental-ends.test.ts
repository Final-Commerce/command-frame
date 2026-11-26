import { describe, expect, it, vi } from 'vitest';
import { MOCK_PRODUCT_HAIRCUT } from '../../demo/database';
import { mockGetBookingRentalEnds } from './mock';
import { MOCK_ONLY_SINGLE_SLOTS } from '../hold-booking/mock';

vi.spyOn(console, 'log').mockImplementation(() => undefined);

describe('getBookingRentalEnds mock', () => {
  it('refuses like holdBooking refuses a stay: the mock shop has no date-range rules', async () => {
    const result = await mockGetBookingRentalEnds({
      productId: MOCK_PRODUCT_HAIRCUT._id!,
      startAt: new Date().toISOString(),
      untilDay: '2030-01-31',
    });
    expect(result).toMatchObject({ success: false, reason: MOCK_ONLY_SINGLE_SLOTS });
    expect(result.ends).toBeUndefined();
  });
});
