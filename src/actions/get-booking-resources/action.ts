/**
 * Get booking resources action
 * Calls the getBookingResources action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { GetBookingResources, GetBookingResourcesParams, GetBookingResourcesResponse } from './types';

export const getBookingResources: GetBookingResources = async (
  params?: GetBookingResourcesParams,
): Promise<GetBookingResourcesResponse> => {
  return await commandFrameClient.call<GetBookingResourcesParams, GetBookingResourcesResponse>(
    'getBookingResources',
    params,
  );
};
