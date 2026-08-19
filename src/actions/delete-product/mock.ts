import { DeleteProduct, DeleteProductParams, DeleteProductResponse } from './types';

export const mockDeleteProduct: DeleteProduct = async (params: DeleteProductParams): Promise<DeleteProductResponse> => {
  console.log('[Mock] deleteProduct called', params);
  return {
    success: true,
    productId: params.productId,
    deletedVariantIds: [],
    timestamp: new Date().toISOString(),
  };
};
