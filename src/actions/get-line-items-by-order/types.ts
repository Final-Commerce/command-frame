import { CFLineItem, CFCustomSale } from "../../CommonTypes";

// Get Line Items By Order Types
export interface GetLineItemsByOrderParams {
    /** If not provided, uses the currently active order. */
    orderId?: string;
}

export interface GetLineItemsByOrderResponse {
    success: boolean;
    orderId: string;
    lineItems: CFLineItem[]; // LineItem[]
    customSales: CFCustomSale[]; // CustomSale[]
    remainingQuantities: Record<string, number>; // itemKey: remaining qty
    remainingCustomSalesQuantities: Record<string, number>; // customSaleId: remaining qty
    timestamp: string;
}

export type GetLineItemsByOrder = (params?: GetLineItemsByOrderParams) => Promise<GetLineItemsByOrderResponse>;

