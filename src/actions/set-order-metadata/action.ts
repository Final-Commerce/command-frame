/**
 * Set order metadata action
 * Calls the setOrderMetadata action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { SetOrderMetadata, SetOrderMetadataParams, SetOrderMetadataResponse } from './types';

export const setOrderMetadata: SetOrderMetadata = async (
  params: SetOrderMetadataParams,
): Promise<SetOrderMetadataResponse> => {
  return await commandFrameClient.call<SetOrderMetadataParams, SetOrderMetadataResponse>('setOrderMetadata', params);
};
