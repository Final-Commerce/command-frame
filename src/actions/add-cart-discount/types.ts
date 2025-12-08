// Add Cart Discount Types
export interface AddCartDiscountParams {
    amount: number;
    isPercent?: boolean;
    label?: string;
}

export interface AddCartDiscountResponse {
    success: boolean;
    amount: number;
    isPercent: boolean;
    label: string;
    timestamp: string;
}

export type AddCartDiscount = (params?: AddCartDiscountParams) => Promise<AddCartDiscountResponse>;

