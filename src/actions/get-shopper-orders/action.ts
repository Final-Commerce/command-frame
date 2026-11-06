/**
 * getShopperOrders action
 * Calls the getShopperOrders action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { GetShopperOrders, GetShopperOrdersParams, GetShopperOrdersResponse } from './types';

export const getShopperOrders: GetShopperOrders = async (
  params?: GetShopperOrdersParams,
): Promise<GetShopperOrdersResponse> => {
  return await commandFrameClient.call<GetShopperOrdersParams, GetShopperOrdersResponse>(
    'getShopperOrders',
    params ?? ({} as GetShopperOrdersParams),
  );
};
