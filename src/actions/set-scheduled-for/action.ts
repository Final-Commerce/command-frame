/**
 * Set scheduled-for action
 * Calls the setScheduledFor action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { SetScheduledFor, SetScheduledForParams, SetScheduledForResponse } from './types';

export const setScheduledFor: SetScheduledFor = async (
  params: SetScheduledForParams,
): Promise<SetScheduledForResponse> => {
  return await commandFrameClient.call<SetScheduledForParams, SetScheduledForResponse>('setScheduledFor', params);
};
