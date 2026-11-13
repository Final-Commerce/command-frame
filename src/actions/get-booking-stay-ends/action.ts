/**
 * Get booking stay ends action
 * Calls the getBookingStayEnds action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { GetBookingStayEnds, GetBookingStayEndsParams, GetBookingStayEndsResponse } from './types';

export const getBookingStayEnds: GetBookingStayEnds = async (
  params: GetBookingStayEndsParams,
): Promise<GetBookingStayEndsResponse> => {
  return await commandFrameClient.call<GetBookingStayEndsParams, GetBookingStayEndsResponse>(
    'getBookingStayEnds',
    params,
  );
};
