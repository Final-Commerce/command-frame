// Remove Product Discount Types
export interface RemoveProductDiscountParams {
    /** If provided, removes discount from specific cart item. Otherwise uses active product. */
    internalId?: string;
}

export interface RemoveProductDiscountResponse {
    success: boolean;
    internalId?: string;
    timestamp: string;
}

export type RemoveProductDiscount = (params?: RemoveProductDiscountParams) => Promise<RemoveProductDiscountResponse>;
