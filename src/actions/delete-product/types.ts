export interface DeleteProductParams {
    productId: string;
}

export interface DeleteProductResponse {
    success: boolean;
    timestamp: string;
}

export type DeleteProduct = (params: DeleteProductParams) => Promise<DeleteProductResponse>;
