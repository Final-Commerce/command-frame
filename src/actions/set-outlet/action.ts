/**
 * Set Outlet action
 * Calls the setOutlet action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { SetOutlet, SetOutletParams, SetOutletResponse } from './types';

export const setOutlet: SetOutlet = async (params: SetOutletParams): Promise<SetOutletResponse> => {
  return await commandFrameClient.call<SetOutletParams, SetOutletResponse>('setOutlet', params);
};
