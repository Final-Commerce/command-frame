// Remove Cart Fee Types
export interface RemoveCartFeeParams {
    /** Index of fee to remove from cart.customFee array */
    index: number;
}

export interface RemoveCartFeeResponse {
    success: boolean;
    timestamp: string;
}

export type RemoveCartFee = (params: RemoveCartFeeParams) => Promise<RemoveCartFeeResponse>;
