import { GetBookingRentalEnds, GetBookingRentalEndsParams, GetBookingRentalEndsResponse } from './types';
import { MOCK_ONLY_SINGLE_SLOTS } from '../hold-booking/mock';

// The mock shop has no date-range rules, so no stay can start in it — the same refusal `holdBooking` gives a stay.
export const mockGetBookingRentalEnds: GetBookingRentalEnds = async (
  params: GetBookingRentalEndsParams,
): Promise<GetBookingRentalEndsResponse> => {
  console.log('[Mock] getBookingRentalEnds called', params);
  return { success: false, reason: MOCK_ONLY_SINGLE_SLOTS, timestamp: new Date().toISOString() };
};
