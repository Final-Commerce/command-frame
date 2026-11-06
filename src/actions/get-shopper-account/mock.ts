import type { GetShopperAccount, GetShopperAccountResponse } from './types';

/** Standalone mock: a guest, with the two checkout boxes. */
export const mockGetShopperAccount: GetShopperAccount = async (): Promise<GetShopperAccountResponse> => {
  console.log('[Mock] getShopperAccount called');
  return {
    success: true,
    signedIn: false,
    boxes: [
      { id: 'accountOptIn', label: 'Track this order and check out faster next time', checked: false },
      { id: 'marketingOptIn', label: 'Email me news and offers from this store', checked: false },
    ],
  };
};
