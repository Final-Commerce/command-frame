import { commandFrameClient } from '../../client';
import type { SetProductOutlets, SetProductOutletsParams, SetProductOutletsResponse } from './types';

export const setProductOutlets: SetProductOutlets = async (
  params: SetProductOutletsParams,
): Promise<SetProductOutletsResponse> => {
  return await commandFrameClient.call<SetProductOutletsParams, SetProductOutletsResponse>('setProductOutlets', params);
};
