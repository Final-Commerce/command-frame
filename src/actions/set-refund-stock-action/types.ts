// Set Refund Stock Action Types
export interface SetRefundStockActionParams {
  orderId?: string;
  /** The 'key' field from getLineItemsByOrder response (internalId, falling back to variantId). */
  itemKey: string;
  action: 'RESTOCK' | 'REFUND_DAMAGE';
}

export interface SetRefundStockActionResponse {
  success: boolean;
  orderId?: string;
  itemKey: string;
  action: string;
  timestamp: string;
}

export type SetRefundStockAction = (params?: SetRefundStockActionParams) => Promise<SetRefundStockActionResponse>;
