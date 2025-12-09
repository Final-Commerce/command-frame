import { ParkOrder, ParkOrderResponse } from "./types";
import { MOCK_ORDERS } from "../../demo/database";

export const mockParkOrder: ParkOrder = async (): Promise<ParkOrderResponse> => {
    console.log("[Mock] parkOrder called");
    
    return {
        success: true,
        order: MOCK_ORDERS[0],
        timestamp: new Date().toISOString()
    };
};

