// Add Product Discount Types
export interface AddProductDiscountParams {
    /** The discount amount in integer MINOR currency units (e.g. 500 = $5.00). If isPercent is true, this is a percentage (0-100) instead. */
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
