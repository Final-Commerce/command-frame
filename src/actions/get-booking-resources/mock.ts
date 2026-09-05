import { GetBookingResources, GetBookingResourcesParams, GetBookingResourcesResponse } from './types';
import { MOCK_BOOKING_RESOURCES } from '../../demo/database';

export const mockGetBookingResources: GetBookingResources = async (
  params?: GetBookingResourcesParams,
): Promise<GetBookingResourcesResponse> => {
  console.log('[Mock] getBookingResources called', params);
  const resources = params?.outletId
    ? MOCK_BOOKING_RESOURCES.filter(({ outletId }) => !outletId || outletId === params.outletId)
    : MOCK_BOOKING_RESOURCES;
  return { resources, timestamp: new Date().toISOString() };
};
