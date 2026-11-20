import type { GetShopperOrders, GetShopperOrdersResponse } from './types';

export const mockGetShopperOrders: GetShopperOrders = async (): Promise<GetShopperOrdersResponse> => {
  console.log('[Mock] getShopperOrders called');
  return {
    success: true,
    orders: [
      {
        orderId: '6a2f1c7b1e35f9a4c67a1010',
        receiptId: '#1042',
        placedAtLabel: 'Nov 1, 2026',
        status: 'paid',
        statusLabel: 'Paid',
        totalLabel: '$42.50',
        itemsLabel: '3 items',
      },
    ],
    nextCursor: null,
  };
};
