/**
 * signOutShopper action
 * Calls the signOutShopper action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { SignOutShopper, SignOutShopperParams, SignOutShopperResponse } from './types';

export const signOutShopper: SignOutShopper = async (
  params?: SignOutShopperParams,
): Promise<SignOutShopperResponse> => {
  return await commandFrameClient.call<SignOutShopperParams, SignOutShopperResponse>(
    'signOutShopper',
    params ?? ({} as SignOutShopperParams),
  );
};
