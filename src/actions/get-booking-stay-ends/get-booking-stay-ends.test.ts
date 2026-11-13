import { describe, expect, it, vi } from 'vitest';
import { MOCK_PRODUCT_HAIRCUT } from '../../demo/database';
import { mockGetBookingStayEnds } from './mock';
import { MOCK_ONLY_SINGLE_SLOTS } from '../hold-booking/mock';

vi.spyOn(console, 'log').mockImplementation(() => undefined);

describe('getBookingStayEnds mock', () => {
  it('refuses like holdBooking refuses a stay: the mock shop has no date-range rules', async () => {
    const result = await mockGetBookingStayEnds({
      productId: MOCK_PRODUCT_HAIRCUT._id!,
      startAt: new Date().toISOString(),
    });
    expect(result).toMatchObject({ success: false, reason: MOCK_ONLY_SINGLE_SLOTS });
    expect(result.ends).toBeUndefined();
  });
});
