// Select All Refund Items Types
export interface SelectAllRefundItemsResponse {
    success: boolean;
    selectedItemsCount: number;
    timestamp: string;
}

export type SelectAllRefundItems = () => Promise<SelectAllRefundItemsResponse>;

