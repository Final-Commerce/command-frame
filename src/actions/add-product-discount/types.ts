// Add Product Discount Types
export interface AddProductDiscountParams {
    /** The discount amount. If isPercent is true, this is a percentage. */
    amount: number;
    /** Defaults to `false`. */
    isPercent?: boolean;
    /** Defaults to "Discount". */
    label?: string;
    cartItemId?: string;
}

export interface AddProductDiscountResponse {
    success: boolean;
    amount: number;
    isPercent: boolean;
    label: string;
    cartItemId?: string;
    timestamp: string;
}

export type AddProductDiscount = (params?: AddProductDiscountParams) => Promise<AddProductDiscountResponse>;
