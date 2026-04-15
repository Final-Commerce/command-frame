// Remove Product Fee Types
export interface RemoveProductFeeParams {
    /** If provided, removes fee from specific cart item. Otherwise uses active product. */
    internalId?: string;
}

export interface RemoveProductFeeResponse {
    success: boolean;
    internalId?: string;
    timestamp: string;
}

export type RemoveProductFee = (params?: RemoveProductFeeParams) => Promise<RemoveProductFeeResponse>;
