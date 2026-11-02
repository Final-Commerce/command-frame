import { SelectAllRefundItems, SelectAllRefundItemsParams, SelectAllRefundItemsResponse } from "./types";

export const mockSelectAllRefundItems: SelectAllRefundItems = async (
    _params?: SelectAllRefundItemsParams
): Promise<SelectAllRefundItemsResponse> => {
    console.log("[Mock] selectAllRefundItems called", _params);
    
    return {
        success: true,
        selectedItemsCount: 5,
        timestamp: new Date().toISOString()
    };
};
