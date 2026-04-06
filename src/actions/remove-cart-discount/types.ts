// Remove Cart Discount Types
export interface RemoveCartDiscountResponse {
    success: boolean;
    timestamp: string;
}

export type RemoveCartDiscount = () => Promise<RemoveCartDiscountResponse>;