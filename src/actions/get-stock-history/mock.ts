import { MOCK_STOCK_CHANGES, safeSerialize } from '../../demo/database';
import { GetStockHistory, GetStockHistoryParams, GetStockHistoryResponse } from './types';

export const mockGetStockHistory: GetStockHistory = async (
  params: GetStockHistoryParams,
): Promise<GetStockHistoryResponse> => {
  console.log('[Mock] getStockHistory called', params);

  // MOCK_STOCK_CHANGES is appended chronologically by mockAdjustStock; the
  // audit trail reads newest first (spec §6.5).
  const filtered = MOCK_STOCK_CHANGES.filter(
    (entry) => entry.productId === params.productId && (!params.variantId || entry.variantId === params.variantId),
  ).reverse();

  const offset = params.offset ?? 0;
  const entries = params.limit !== undefined ? filtered.slice(offset, offset + params.limit) : filtered.slice(offset);

  return {
    success: true,
    entries: safeSerialize(entries),
    total: filtered.length,
    timestamp: new Date().toISOString(),
  };
};
