/**
 * Charge MOTO action
 * Calls the chargeMoto action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { ChargeMoto, ChargeMotoParams, ChargeMotoResponse } from './types';

export const chargeMoto: ChargeMoto = async (params: ChargeMotoParams): Promise<ChargeMotoResponse> => {
  return await commandFrameClient.call<ChargeMotoParams, ChargeMotoResponse>('chargeMoto', params);
};
