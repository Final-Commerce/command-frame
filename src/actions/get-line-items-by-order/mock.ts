import { GetLineItemsByOrder, GetLineItemsByOrderParams, GetLineItemsByOrderResponse } from "./types";

export const mockGetLineItemsByOrder: GetLineItemsByOrder = async (params?: GetLineItemsByOrderParams): Promise<GetLineItemsByOrderResponse> => {
    console.log("[Mock] getLineItemsByOrder called", params);
    
    return {
        success: true,
        orderId: params?.orderId || "mock_order_id",
        lineItems: [],
        customSales: [],
        remainingQuantities: {},
        remainingCustomSalesQuantities: {},
        timestamp: new Date().toISOString()
    };
};

