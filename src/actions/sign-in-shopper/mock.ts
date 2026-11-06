import type { SignInShopper, SignInShopperParams, SignInShopperResponse } from './types';

export const mockSignInShopper: SignInShopper = async (params: SignInShopperParams): Promise<SignInShopperResponse> => {
  console.log('[Mock] signInShopper called', params);
  return params.code === '000000'
    ? { success: false, reason: 'That code is wrong' }
    : { success: true, shopper: { name: params.email.split('@')[0] ?? '', email: params.email } };
};
