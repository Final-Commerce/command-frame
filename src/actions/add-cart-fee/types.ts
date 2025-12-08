// Add Cart Fee Types
export interface AddCartFeeParams {
    amount: number;
    isPercent?: boolean;
    label?: string;
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

