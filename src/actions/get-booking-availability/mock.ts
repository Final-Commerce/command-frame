import { GetBookingAvailability, GetBookingAvailabilityParams, GetBookingAvailabilityResponse } from './types';
import { mockBookingAvailability } from '../../demo/database';

export const mockGetBookingAvailability: GetBookingAvailability = async (
  params: GetBookingAvailabilityParams,
): Promise<GetBookingAvailabilityResponse> => {
  console.log('[Mock] getBookingAvailability called', params);
  const availability = mockBookingAvailability(
    params.productId,
    new Date(params.from),
    new Date(params.to),
    params.resourceId,
  );
  return { availability, timestamp: new Date().toISOString() };
};
