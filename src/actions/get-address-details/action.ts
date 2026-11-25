/**
 * getAddressDetails action
 * Calls the getAddressDetails action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { GetAddressDetails, GetAddressDetailsParams, GetAddressDetailsResponse } from './types';

export const getAddressDetails: GetAddressDetails = async (
  params: GetAddressDetailsParams,
): Promise<GetAddressDetailsResponse> => {
  return await commandFrameClient.call<GetAddressDetailsParams, GetAddressDetailsResponse>('getAddressDetails', params);
};
