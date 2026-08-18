import { commandFrameClient } from '../../client';
import type { GetProductVisibility, GetProductVisibilityParams, GetProductVisibilityResponse } from './types';

export const getProductVisibility: GetProductVisibility = async (
  params: GetProductVisibilityParams,
): Promise<GetProductVisibilityResponse> => {
  return await commandFrameClient.call<GetProductVisibilityParams, GetProductVisibilityResponse>(
    'getProductVisibility',
    params,
  );
};
