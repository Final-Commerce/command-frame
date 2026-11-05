/**
 * Get MOTO config action
 * Calls the getMotoConfig action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { GetMotoConfig, GetMotoConfigResponse } from './types';

export const getMotoConfig: GetMotoConfig = async (): Promise<GetMotoConfigResponse> => {
  return await commandFrameClient.call<undefined, GetMotoConfigResponse>('getMotoConfig', undefined);
};
