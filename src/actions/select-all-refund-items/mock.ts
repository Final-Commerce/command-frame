import { SelectAllRefundItems, SelectAllRefundItemsResponse } from "./types";

export const mockSelectAllRefundItems: SelectAllRefundItems = async (): Promise<SelectAllRefundItemsResponse> => {
    console.log("[Mock] selectAllRefundItems called");
    
    return {
        success: true,
        selectedItemsCount: 5,
        timestamp: new Date().toISOString()
    };
};

