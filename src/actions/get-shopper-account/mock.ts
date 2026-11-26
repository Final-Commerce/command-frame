import type { GetShopperAccount, GetShopperAccountResponse } from './types';

/** Standalone mock: a guest, with the guest's checkout box. */
export const mockGetShopperAccount: GetShopperAccount = async (): Promise<GetShopperAccountResponse> => {
  console.log('[Mock] getShopperAccount called');
  return {
    success: true,
    signedIn: false,
    boxes: [{ id: 'accountOptIn', label: 'Track this order and check out faster next time', checked: false }],
  };
};
