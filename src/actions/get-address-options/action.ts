/**
 * GetAddressOptions action
 * Calls the getAddressOptions action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { GetAddressOptions, GetAddressOptionsParams, GetAddressOptionsResponse } from './types';

export const getAddressOptions: GetAddressOptions = async (
  params?: GetAddressOptionsParams,
): Promise<GetAddressOptionsResponse> => {
  return await commandFrameClient.call<GetAddressOptionsParams, GetAddressOptionsResponse>('getAddressOptions', params);
};
