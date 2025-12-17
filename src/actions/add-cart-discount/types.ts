// Add Cart Discount Types
export interface AddCartDiscountParams {
    /** The discount amount. If isPercent is true, this is a percentage (0-100). Otherwise, it is in major currency units (e.g., 10.50), not cents. */
    amount: number;
    /** Defaults to `false`. */
    isPercent?: boolean;
    /** Defaults to "Discount". */
    label?: string;
}

export interface AddCartDiscountResponse {
    success: boolean;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount: number;
    isPercent: boolean;
    label: string;
    timestamp: string;
}

export type AddCartDiscount = (params?: AddCartDiscountParams) => Promise<AddCartDiscountResponse>;

