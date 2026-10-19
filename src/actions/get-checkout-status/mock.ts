import { GetCheckoutStatus, GetCheckoutStatusParams, GetCheckoutStatusResponse } from './types';

/** Standalone mock: every order the preview knows about is already paid. */
export const mockGetCheckoutStatus: GetCheckoutStatus = async (
  params: GetCheckoutStatusParams,
): Promise<GetCheckoutStatusResponse> => {
  console.log('[Mock] getCheckoutStatus called', params);
  return {
    success: true,
    status: params?.orderPassword ? 'paid' : null,
    paid: Boolean(params?.orderPassword),
    receiptId: params?.orderPassword ? 'ON-001-000001' : null,
    timestamp: new Date().toISOString(),
  };
};
