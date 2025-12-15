// Select All Refund Items Types
export interface SelectAllRefundItemsParams {
    orderId?: string;
}

export interface SelectAllRefundItemsResponse {
    success: boolean;
    selectedItemsCount: number;
    timestamp: string;
}

export type SelectAllRefundItems = (params?: SelectAllRefundItemsParams) => Promise<SelectAllRefundItemsResponse>;
