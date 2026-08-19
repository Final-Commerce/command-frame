// Soft delete; cascades to variants ONLY (§6.6).
export interface DeleteProductParams {
  productId: string;
}

export interface DeleteProductResponse {
  success: boolean;
  productId: string;
  deletedVariantIds: string[];
  timestamp: string;
}

export type DeleteProduct = (params: DeleteProductParams) => Promise<DeleteProductResponse>;
