// Add Product Discount Types
export interface AddProductDiscountParams {
    /** The discount amount. If isPercent is true, this is a percentage. */
    amount: number;
    /** Defaults to `false`. */
    isPercent?: boolean;
    /** Defaults to "Discount". */
    label?: string;
    /** The unique identifier for a specific line item in the cart. */
    internalId?: string;
}

export interface AddProductDiscountResponse {
    success: boolean;
    amount: number;
    isPercent: boolean;
    label: string;
    internalId?: string;
    timestamp: string;
}

export type AddProductDiscount = (params?: AddProductDiscountParams) => Promise<AddProductDiscountResponse>;
