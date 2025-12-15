// Add Product Fee Types
export interface AddProductFeeParams {
    amount: number;
    isPercent?: boolean;
    label?: string;
    applyTaxes?: boolean;
    taxTableId?: string;
    cartItemId?: string;
}

export interface AddProductFeeResponse {
    success: boolean;
    amount: number;
    isPercent: boolean;
    label: string;
    applyTaxes: boolean;
    cartItemId?: string;
    timestamp: string;
}

export type AddProductFee = (params?: AddProductFeeParams) => Promise<AddProductFeeResponse>;
