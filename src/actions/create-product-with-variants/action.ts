import { commandFrameClient } from '../../client';
import type {
  CreateProductWithVariants,
  CreateProductWithVariantsParams,
  CreateProductWithVariantsResponse,
} from './types';

export const createProductWithVariants: CreateProductWithVariants = async (
  params: CreateProductWithVariantsParams,
): Promise<CreateProductWithVariantsResponse> => {
  return await commandFrameClient.call<CreateProductWithVariantsParams, CreateProductWithVariantsResponse>(
    'createProductWithVariants',
    params,
  );
};
