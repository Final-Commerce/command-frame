// Add Product Discount Types
export interface AddProductDiscountParams {
    amount: number;
    isPercent?: boolean;
    label?: string;
}

export interface AddProductDiscountResponse {
    success: boolean;
    amount: number;
    isPercent: boolean;
    label: string;
    timestamp: string;
}

export type AddProductDiscount = (params?: AddProductDiscountParams) => Promise<AddProductDiscountResponse>;

