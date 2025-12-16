// Add Cart Fee Types
export interface AddCartFeeParams {
    /** The fee amount. If isPercent is true, this is a percentage. */
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
    amount: number;
    isPercent: boolean;
    label: string;
    applyTaxes: boolean;
    timestamp: string;
}

export type AddCartFee = (params?: AddCartFeeParams) => Promise<AddCartFeeResponse>;

