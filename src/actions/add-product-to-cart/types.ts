// Add Product To Cart Types
import type { AddProductDiscountParams } from "../add-product-discount/types";
import type { AddProductFeeParams } from "../add-product-fee/types";

export interface AddProductToCartParams {
    productId?: string;
    variantId?: string;
    quantity?: number;
    discounts?: AddProductDiscountParams[];
    fees?: AddProductFeeParams[];
    notes?: string | string[];
}

export interface AddProductToCartResponse {
    success: boolean;
    productId: string;
    variantId: string;
    internalId: string;
    name: string;
    quantity: number;
    timestamp: string;
}

export type AddProductToCart = (params?: AddProductToCartParams) => Promise<AddProductToCartResponse>;
