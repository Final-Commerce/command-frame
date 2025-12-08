// Get Product Variants Types
export interface GetProductVariantsParams {
    productId: string;
}

export interface GetProductVariantsResponse {
    variants: any[];
    productId: string;
    timestamp: string;
}

export type GetProductVariants = (params?: GetProductVariantsParams) => Promise<GetProductVariantsResponse>;

