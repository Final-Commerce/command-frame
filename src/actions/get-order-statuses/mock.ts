import type { GetOrderStatuses, GetOrderStatusesResponse } from './types';
import { MOCK_ORDER_STATUSES } from '../../demo/database';

export const mockGetOrderStatuses: GetOrderStatuses = async (): Promise<GetOrderStatusesResponse> => {
  console.log('[Mock] getOrderStatuses called');
  return { success: true, statuses: MOCK_ORDER_STATUSES.map((s) => ({ ...s })), timestamp: new Date().toISOString() };
};
