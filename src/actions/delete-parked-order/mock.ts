import { DeleteParkedOrder, DeleteParkedOrderParams, DeleteParkedOrderResponse } from "./types";
import { MOCK_PARKED_ORDERS } from "../../demo/database";

export const mockDeleteParkedOrder: DeleteParkedOrder = async (params?: DeleteParkedOrderParams): Promise<DeleteParkedOrderResponse> => {
    console.log("[Mock] deleteParkedOrder called", params);
    
    if (params?.orderId) {
        const index = MOCK_PARKED_ORDERS.findIndex(o => o._id === params.orderId);
        if (index !== -1) {
            MOCK_PARKED_ORDERS.splice(index, 1);
        }
    }

    return {
        success: true,
        orderId: params?.orderId || "",
        timestamp: new Date().toISOString()
    };
};

