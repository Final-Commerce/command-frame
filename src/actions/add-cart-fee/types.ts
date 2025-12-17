// Add Cart Fee Types
export interface AddCartFeeParams {
    /** The fee amount. If isPercent is true, this is a percentage. Otherwise, it is in major currency units (e.g., 10.50), not cents. */
    amount: number;
    /** Defaults to `false`. */
    isPercent?: boolean;
    /** Defaults to "Fee". */
    label?: string;
    /** Defaults to `false`. */
    applyTaxes?: boolean;
    taxTableId?: string;
}

export interface AddCartFeeResponse {
    success: boolean;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount: number;
    isPercent: boolean;
    label: string;
    applyTaxes: boolean;
    timestamp: string;
}

export type AddCartFee = (params?: AddCartFeeParams) => Promise<AddCartFeeResponse>;

