// Add Product To Cart Types
export interface AddProductToCartParams {
    productId?: string;
    variantId?: string;
    quantity?: number;
}

export interface AddProductToCartResponse {
    success: boolean;
    productId: string;
    variantId: string;
    name: string;
    quantity: number;
    timestamp: string;
}

export type AddProductToCart = (params?: AddProductToCartParams) => Promise<AddProductToCartResponse>;
