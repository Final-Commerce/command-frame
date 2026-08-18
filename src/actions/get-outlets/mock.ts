import { GetOutlets, GetOutletsResponse } from './types';
import { MOCK_OUTLETS, safeSerialize } from '../../demo/database';

export const mockGetOutlets: GetOutlets = async (): Promise<GetOutletsResponse> => {
  console.log('[Mock] getOutlets called');
  const outlets = safeSerialize(MOCK_OUTLETS).map((o) => ({
    _id: o._id || o.id,
    name: o.name || '',
  }));
  return {
    success: true,
    outlets,
    timestamp: new Date().toISOString(),
  };
};
