/**
 * signInShopper action
 * Calls the signInShopper action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { SignInShopper, SignInShopperParams, SignInShopperResponse } from './types';

export const signInShopper: SignInShopper = async (params: SignInShopperParams): Promise<SignInShopperResponse> => {
  return await commandFrameClient.call<SignInShopperParams, SignInShopperResponse>(
    'signInShopper',
    params ?? ({} as SignInShopperParams),
  );
};
