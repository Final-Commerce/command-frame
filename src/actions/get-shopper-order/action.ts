/**
 * getShopperOrder action
 * Calls the getShopperOrder action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { GetShopperOrder, GetShopperOrderParams, GetShopperOrderResponse } from './types';

export const getShopperOrder: GetShopperOrder = async (
  params: GetShopperOrderParams,
): Promise<GetShopperOrderResponse> => {
  return await commandFrameClient.call<GetShopperOrderParams, GetShopperOrderResponse>(
    'getShopperOrder',
    params ?? ({} as GetShopperOrderParams),
  );
};
