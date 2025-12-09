import { SetRefundStockAction, SetRefundStockActionParams, SetRefundStockActionResponse } from "./types";

export const mockSetRefundStockAction: SetRefundStockAction = async (params?: SetRefundStockActionParams): Promise<SetRefundStockActionResponse> => {
    console.log("[Mock] setRefundStockAction called", params);
    
    return {
        success: true,
        itemKey: params?.itemKey || "",
        action: params?.action || "RESTOCK",
        timestamp: new Date().toISOString()
    };
};

