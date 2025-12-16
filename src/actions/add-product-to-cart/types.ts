// Add Product To Cart Types
import type { AddProductDiscountParams } from "../add-product-discount/types";
import type { AddProductFeeParams } from "../add-product-fee/types";

export interface AddProductToCartParams {
    /** ID of the variant to add. Optional but recommended. */
    variantId?: string;
    /** Defaults to 1. */
    quantity?: number;
    /** Array of discounts to apply immediately. */
    discounts?: AddProductDiscountParams[];
    /** Array of fees to apply immediately. */
    fees?: AddProductFeeParams[];
    /** Note or array of notes to add immediately. */
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
