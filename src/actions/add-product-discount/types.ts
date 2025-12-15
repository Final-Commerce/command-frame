// Add Product Discount Types
export interface AddProductDiscountParams {
    amount: number;
    isPercent?: boolean;
    label?: string;
    cartItemId?: string;
}

export interface AddProductDiscountResponse {
    success: boolean;
    amount: number;
    isPercent: boolean;
    label: string;
    cartItemId?: string;
    timestamp: string;
}

export type AddProductDiscount = (params?: AddProductDiscountParams) => Promise<AddProductDiscountResponse>;
