import { MOCK_ORDERS, safeSerialize } from "../../demo/database";
import { GetActiveOrder, GetActiveOrderResponse } from "./types";

export const mockGetActiveOrder: GetActiveOrder = async (): Promise<GetActiveOrderResponse> => {
    console.log("[Mock] getActiveOrder called");

    const orders = safeSerialize(MOCK_ORDERS);
    const order = orders.length > 0 ? orders[0] : null;

    return {
        success: true,
        order,
        timestamp: new Date().toISOString()
    };
};
