import { SetProductOutlets, SetProductOutletsParams, SetProductOutletsResponse } from './types';
import { MOCK_HIDDEN_OUTLETS, MOCK_OUTLETS } from '../../demo/database';

export const mockSetProductOutlets: SetProductOutlets = async (
  params: SetProductOutletsParams,
): Promise<SetProductOutletsResponse> => {
  console.log('[Mock] setProductOutlets called', params);

  // hidden = activeOutletIds − available (available used as-given, not intersected); §3.3.4.
  const activeOutletIds = MOCK_OUTLETS.map((o) => o.id);
  const hiddenOutletIds = activeOutletIds.filter((id) => !params.availableOutletIds.includes(id));
  const shownOutletIds = params.availableOutletIds.filter((id) => activeOutletIds.includes(id));

  // Persist the reconcile result so getProductVisibility round-trips in-session.
  MOCK_HIDDEN_OUTLETS[params.productId] = hiddenOutletIds;

  return {
    success: true,
    hiddenOutletIds,
    shownOutletIds,
    timestamp: new Date().toISOString(),
  };
};
