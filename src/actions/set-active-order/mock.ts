import { SetActiveOrder, SetActiveOrderParams, SetActiveOrderResponse } from "./types";

export const mockSetActiveOrder: SetActiveOrder = async (params?: SetActiveOrderParams): Promise<SetActiveOrderResponse> => {
    console.log("[Mock] setActiveOrder called", params);
    
    if (!params?.orderId) {
        throw new Error("Order ID is required");
    }

    // Mock order response
    return {
        success: true,
        order: {
            _id: params.orderId,
            id: params.orderId,
            status: "completed",
            companyId: "mock-company",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        } as any,
        timestamp: new Date().toISOString()
    };
};
