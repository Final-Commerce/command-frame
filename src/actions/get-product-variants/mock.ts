import { GetProductVariants, GetProductVariantsParams, GetProductVariantsResponse } from './types';
import { MOCK_PRODUCTS, safeSerialize } from '../../demo/database';

export const mockGetProductVariants: GetProductVariants = async (
  params: GetProductVariantsParams,
): Promise<GetProductVariantsResponse> => {
  console.log('[Mock] getProductVariants called', params);

  const product = MOCK_PRODUCTS.find((p) => p._id === params.productId);
  const variants = (product?.variants || []).filter((v) => params.includeDeleted || !v.isDeleted);

  return {
    success: true,
    variants: safeSerialize(variants),
    timestamp: new Date().toISOString(),
  };
};
