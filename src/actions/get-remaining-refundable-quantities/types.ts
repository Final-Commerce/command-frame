// Get Remaining Refundable Quantities Types
export interface GetRemainingRefundableQuantitiesResponse {
    success: boolean;
    lineItems: Record<string, number>; // itemKey: remaining qty
    customSales: Record<string, number>; // customSaleId: remaining qty
    timestamp: string;
}

export type GetRemainingRefundableQuantities = () => Promise<GetRemainingRefundableQuantitiesResponse>;

