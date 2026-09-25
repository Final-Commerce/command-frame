import { GetBookingAvailability, GetBookingAvailabilityParams, GetBookingAvailabilityResponse } from './types';
import { mockBookingAvailability } from '../../demo/database';

export const mockGetBookingAvailability: GetBookingAvailability = async (
  params: GetBookingAvailabilityParams,
): Promise<GetBookingAvailabilityResponse> => {
  console.log('[Mock] getBookingAvailability called', params);
  // `fromDay` + `days` is the shape a calendar actually asks in; the mock resolves it on the
  // machine's clock, which is the only one it has.
  const start = params.fromDay ? new Date(`${params.fromDay}T00:00:00`) : params.from ? new Date(params.from) : new Date();
  const end = params.to
    ? new Date(params.to)
    : new Date(start.getFullYear(), start.getMonth(), start.getDate() + Math.max(1, params.days ?? 1));
  const availability = mockBookingAvailability(params.productId, start, end, params.resourceId);
  return { success: true, availability, timestamp: new Date().toISOString() };
};
