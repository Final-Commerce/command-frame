import type { SignInShopper, SignInShopperParams, SignInShopperResponse } from './types';

export const mockSignInShopper: SignInShopper = async (params: SignInShopperParams): Promise<SignInShopperResponse> => {
  console.log('[Mock] signInShopper called', params);
  const email = params.email ?? null;
  return params.code === '000000'
    ? { success: false, reason: 'That code is wrong' }
    : { success: true, shopper: { name: email?.split('@')[0] ?? '', email, phone: params.phone ?? null } };
};
