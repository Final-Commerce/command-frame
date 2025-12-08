// Add Product Fee Types
export interface AddProductFeeParams {
    amount: number;
    isPercent?: boolean;
    label?: string;
    applyTaxes?: boolean;
    taxTableId?: string;
}

export interface AddProductFeeResponse {
    success: boolean;
    amount: number;
    isPercent: boolean;
    label: string;
    applyTaxes: boolean;
    timestamp: string;
}

export type AddProductFee = (params?: AddProductFeeParams) => Promise<AddProductFeeResponse>;

