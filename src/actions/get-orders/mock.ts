import { GetOrders, GetOrdersParams, GetOrdersResponse } from "./types";
import { MOCK_ORDERS, safeSerialize } from "../../demo/database";

export const mockGetOrders: GetOrders = async (params?: GetOrdersParams): Promise<GetOrdersResponse> => {
    console.log("[Mock] getOrders called", params);
    
    let orders = MOCK_ORDERS;
    // Simple mock doesn't implement all complex filters
    
    return {
        success: true,
        orders: safeSerialize(orders),
        total: orders.length,
        timestamp: new Date().toISOString()
    };
};

