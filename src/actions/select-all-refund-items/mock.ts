import { SelectAllRefundItems, SelectAllRefundItemsParams, SelectAllRefundItemsResponse } from './types';
import { MOCK_ORDERS, stageMockRefund } from '../../demo/database';
import { mockRefundRows } from '../get-refund-plan/mockRows';

/**
 * The host's select-all (kaching select-all-refund-items/handler.ts): stages every line and custom sale at what is
 * left of it, every cart fee and tip, for a `processPartialRefund` that names no `items`. The demo keeps no active
 * order, so `orderId` is required.
 */
export const mockSelectAllRefundItems: SelectAllRefundItems = async (
  params?: SelectAllRefundItemsParams,
): Promise<SelectAllRefundItemsResponse> => {
  console.log('[Mock] selectAllRefundItems called', params);

  const order = params?.orderId ? MOCK_ORDERS.find((o) => o._id === params.orderId) : undefined;
  if (!order) {
    throw new Error(
      params?.orderId ? `Order with ID ${params.orderId} not found` : 'No order selected. Please provide orderId.',
    );
  }
  const rows = mockRefundRows(order);
  stageMockRefund({
    orderId: order._id,
    items: rows.map((row) => ({
      itemKey: row.itemKey,
      type: row.type,
      quantity: row.type === 'fee' || row.type === 'tip' ? 1 : row.refundableQuantity,
    })),
  });

  return {
    success: true,
    selectedItemsCount: rows.filter((row) => row.type === 'product' || row.type === 'customSale').length,
    timestamp: new Date().toISOString(),
  };
};
