/**
 * Get time clock status action
 * Calls the getTimeClockStatus action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { GetTimeClockStatus, GetTimeClockStatusResponse } from './types';

export const getTimeClockStatus: GetTimeClockStatus = async (
  params?: Record<string, never>,
): Promise<GetTimeClockStatusResponse> => {
  return await commandFrameClient.call<Record<string, never> | undefined, GetTimeClockStatusResponse>(
    'getTimeClockStatus',
    params,
  );
};
