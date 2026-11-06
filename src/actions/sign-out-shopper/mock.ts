import type { SignOutShopper, SignOutShopperResponse } from './types';

export const mockSignOutShopper: SignOutShopper = async (): Promise<SignOutShopperResponse> => {
  console.log('[Mock] signOutShopper called');
  return { success: true };
};
