import { GetBookingStayEnds, GetBookingStayEndsParams, GetBookingStayEndsResponse } from './types';
import { MOCK_ONLY_SINGLE_SLOTS } from '../hold-booking/mock';

// The mock shop has no date-range rules, so no stay can start in it — the same refusal `holdBooking` gives a stay.
export const mockGetBookingStayEnds: GetBookingStayEnds = async (
  params: GetBookingStayEndsParams,
): Promise<GetBookingStayEndsResponse> => {
  console.log('[Mock] getBookingStayEnds called', params);
  return { success: false, reason: MOCK_ONLY_SINGLE_SLOTS, timestamp: new Date().toISOString() };
};
