import { GetCheckoutStatus, GetCheckoutStatusParams, GetCheckoutStatusResponse } from './types';

/** Standalone mock: every order the preview knows about is already paid. */
export const mockGetCheckoutStatus: GetCheckoutStatus = async (
  params?: GetCheckoutStatusParams,
): Promise<GetCheckoutStatusResponse> => {
  console.log('[Mock] getCheckoutStatus called', params);
  return {
    success: true,
    status: 'paid',
    paid: true,
    receiptId: params?.receiptId ?? 'ON-001-000001',
    timestamp: new Date().toISOString(),
  };
};
