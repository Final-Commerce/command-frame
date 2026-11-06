/**
 * requestShopperCode action
 * Calls the requestShopperCode action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { RequestShopperCode, RequestShopperCodeParams, RequestShopperCodeResponse } from './types';

export const requestShopperCode: RequestShopperCode = async (
  params: RequestShopperCodeParams,
): Promise<RequestShopperCodeResponse> => {
  return await commandFrameClient.call<RequestShopperCodeParams, RequestShopperCodeResponse>(
    'requestShopperCode',
    params ?? ({} as RequestShopperCodeParams),
  );
};
