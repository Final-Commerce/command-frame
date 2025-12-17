// Add Product Fee Types
export interface AddProductFeeParams {
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount: number;
    /** Defaults to `false`. */
    isPercent?: boolean;
    /** Defaults to "Fee". */
    label?: string;
    /** Defaults to `false`. */
    applyTaxes?: boolean;
    taxTableId?: string;
    /** The unique identifier for a specific line item in the cart. */
    internalId?: string;
}

export interface AddProductFeeResponse {
    success: boolean;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount: number;
    isPercent: boolean;
    label: string;
    applyTaxes: boolean;
    internalId?: string;
    timestamp: string;
}

export type AddProductFee = (params?: AddProductFeeParams) => Promise<AddProductFeeResponse>;
