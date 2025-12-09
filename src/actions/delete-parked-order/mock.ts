import { DeleteParkedOrder, DeleteParkedOrderParams, DeleteParkedOrderResponse } from "./types";

export const mockDeleteParkedOrder: DeleteParkedOrder = async (params?: DeleteParkedOrderParams): Promise<DeleteParkedOrderResponse> => {
    console.log("[Mock] deleteParkedOrder called", params);
    
    return {
        success: true,
        orderId: params?.orderId || "",
        timestamp: new Date().toISOString()
    };
};

