import { EditProductVariants, EditProductVariantsParams, EditProductVariantsResponse } from './types';

export const mockEditProductVariants: EditProductVariants = async (
  params: EditProductVariantsParams,
): Promise<EditProductVariantsResponse> => {
  console.log('[Mock] editProductVariants called', params);
  return {
    success: true,
    added: (params.additions || []).map((v, i) => v._id || `mock_variant_${Date.now()}_${i}`),
    changed: (params.changes || []).map((c) => c._id),
    deleted: params.deletions || [],
    timestamp: new Date().toISOString(),
  };
};
