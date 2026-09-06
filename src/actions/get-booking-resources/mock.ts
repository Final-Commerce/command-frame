import { GetBookingResources, GetBookingResourcesParams, GetBookingResourcesResponse } from './types';
import { MOCK_BOOKING_RESOURCES } from '../../demo/database';

export const mockGetBookingResources: GetBookingResources = async (
  params?: GetBookingResourcesParams,
): Promise<GetBookingResourcesResponse> => {
  console.log('[Mock] getBookingResources called', params);
  // A resource knows nothing about outlets — where it works lives in its own records, which the
  // host reads. The mock has no such records, so `outletId` narrows nothing here.
  return { resources: MOCK_BOOKING_RESOURCES, timestamp: new Date().toISOString() };
};
