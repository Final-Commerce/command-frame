/**
 * searchAddresses action
 * Calls the searchAddresses action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { SearchAddresses, SearchAddressesParams, SearchAddressesResponse } from './types';

export const searchAddresses: SearchAddresses = async (
  params: SearchAddressesParams,
): Promise<SearchAddressesResponse> => {
  return await commandFrameClient.call<SearchAddressesParams, SearchAddressesResponse>('searchAddresses', params);
};
