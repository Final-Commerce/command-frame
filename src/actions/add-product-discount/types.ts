// Add Product Discount Types
export interface AddProductDiscountParams {
    /** The discount amount. If isPercent is true, this is a percentage. Otherwise, it is in major currency units (e.g., 10.50), not cents. */
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
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount: number;
    isPercent: boolean;
    label: string;
    internalId?: string;
    timestamp: string;
}

export type AddProductDiscount = (params?: AddProductDiscountParams) => Promise<AddProductDiscountResponse>;
