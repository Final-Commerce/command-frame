import { commandFrameClient } from '../../client';
import type { ComputeVariantChanges, ComputeVariantChangesParams, ComputeVariantChangesResponse } from './types';

export const computeVariantChanges: ComputeVariantChanges = async (
  params: ComputeVariantChangesParams,
): Promise<ComputeVariantChangesResponse> => {
  return await commandFrameClient.call<ComputeVariantChangesParams, ComputeVariantChangesResponse>(
    'computeVariantChanges',
    params,
  );
};
