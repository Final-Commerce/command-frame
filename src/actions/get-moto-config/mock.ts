import { GetMotoConfig, GetMotoConfigResponse } from './types';

/**
 * The mock has no Adyen account to mount card fields against, so it answers honestly: not
 * available. A flow that hides its manual card tender on `available: false` behaves the same
 * in a preview as on a host without a key.
 */
export const mockGetMotoConfig: GetMotoConfig = async (): Promise<GetMotoConfigResponse> => {
  console.log('[Mock] getMotoConfig called');
  return { success: true, timestamp: new Date().toISOString(), available: false, reason: 'no-client-key' };
};
