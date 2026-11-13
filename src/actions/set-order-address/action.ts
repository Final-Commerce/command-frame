/**
 * SetOrderAddress action
 * Calls the setOrderAddress action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { SetOrderAddress, SetOrderAddressParams, SetOrderAddressResponse } from './types';

export const setOrderAddress: SetOrderAddress = async (
  params: SetOrderAddressParams,
): Promise<SetOrderAddressResponse> => {
  return await commandFrameClient.call<SetOrderAddressParams, SetOrderAddressResponse>('setOrderAddress', params);
};
