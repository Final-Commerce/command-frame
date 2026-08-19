import { commandFrameClient } from '../../client';
import type { UpdateProductBundle, UpdateProductBundleParams, UpdateProductBundleResponse } from './types';

export const updateProductBundle: UpdateProductBundle = async (
  params: UpdateProductBundleParams,
): Promise<UpdateProductBundleResponse> => {
  return await commandFrameClient.call<UpdateProductBundleParams, UpdateProductBundleResponse>(
    'updateProductBundle',
    params,
  );
};
