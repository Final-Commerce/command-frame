// Add Product To Cart Types
import type { AddProductDiscountParams } from "../add-product-discount/types";
import type { AddProductFeeParams } from "../add-product-fee/types";
import type { ModifierSelection } from "../get-product-modifier-selections/types";

/**
 * One modifier answer passed at ring-time. Same shape as the
 * get-product-modifier-selections `ModifierSelection` (single source of truth).
 */
export type AddProductToCartModifierParams = ModifierSelection;

export interface AddProductToCartParams {
    /** ID of the variant to add. */
    variantId: string;
    /** Defaults to 1. */
    quantity?: number;
    /** Array of discounts to apply immediately. */
    discounts?: AddProductDiscountParams[];
    /** Array of fees to apply immediately. */
    fees?: AddProductFeeParams[];
    /** Modifier selections to apply immediately. */
    modifiers?: AddProductToCartModifierParams[];
    /** Note or array of notes to add immediately. */
    notes?: string | string[];
}

export interface AddProductToCartResponse {
    success: boolean;
    /** Set when the add was rejected (e.g. a required modifier is unanswered). */
    reason?: string;
    productId: string;
    variantId: string;
    /** The unique identifier for the specific item instance added to the cart. */
    internalId: string;
    name: string;
    quantity: number;
    timestamp: string;
}

export type AddProductToCart = (params?: AddProductToCartParams) => Promise<AddProductToCartResponse>;
