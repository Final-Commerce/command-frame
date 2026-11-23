/**
 * getShopperAccount action
 * Calls the getShopperAccount action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { GetShopperAccount, GetShopperAccountParams, GetShopperAccountResponse } from './types';

export const getShopperAccount: GetShopperAccount = async (
  params?: GetShopperAccountParams,
): Promise<GetShopperAccountResponse> => {
  return await commandFrameClient.call<GetShopperAccountParams, GetShopperAccountResponse>(
    'getShopperAccount',
    params ?? ({} as GetShopperAccountParams),
  );
};
