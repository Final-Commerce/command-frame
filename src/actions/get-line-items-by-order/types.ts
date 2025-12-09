import { CFLineItem, CFCustomSale } from "../../CommonTypes";

// Get Line Items By Order Types
export interface GetLineItemsByOrderParams {
    orderId?: string; // If not provided, uses active order
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

