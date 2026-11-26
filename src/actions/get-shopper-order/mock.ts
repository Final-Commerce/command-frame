import type { GetShopperOrder, GetShopperOrderParams, GetShopperOrderResponse } from './types';

export const mockGetShopperOrder: GetShopperOrder = async (
  params: GetShopperOrderParams,
): Promise<GetShopperOrderResponse> => {
  console.log('[Mock] getShopperOrder called', params);
  return {
    success: true,
    order: {
      orderId: params.orderId,
      receiptId: '#1042',
      placedAtLabel: 'Nov 1, 2026',
      status: 'paid',
      statusLabel: 'Paid',
      totalLabel: '$42.50',
      itemsLabel: '2 items',
      items: [{ name: 'Harbour mug', variant: 'Slate', quantity: 2, totalLabel: '$40.00' }],
      totals: [
        { label: 'Subtotal', amountLabel: '$40.00' },
        { label: 'Tax', amountLabel: '$2.50' },
        { label: 'Total', amountLabel: '$42.50' },
      ],
      paidWithLabel: 'Visa •••• 4242',
      deliveryLabel: 'Pickup at Water St.',
      returnLabel: null,
    },
  };
};
