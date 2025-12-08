// Set Refund Stock Action Types
export interface SetRefundStockActionParams {
    itemKey: string; // The 'key' field from getLineItemsByOrder response (internalId || variantId || productId)
    action: 'RESTOCK' | 'REFUND_DAMAGE';
}

export interface SetRefundStockActionResponse {
    success: boolean;
    itemKey: string;
    action: string;
    timestamp: string;
}

export type SetRefundStockAction = (params?: SetRefundStockActionParams) => Promise<SetRefundStockActionResponse>;

