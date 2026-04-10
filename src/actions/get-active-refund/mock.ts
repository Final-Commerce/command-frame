import { MOCK_ACTIVE_REFUND_DETAILS } from "../../demo/database";
import { GetActiveRefund, GetActiveRefundResponse } from "./types";

export const mockGetActiveRefund: GetActiveRefund = async (): Promise<GetActiveRefundResponse> => {
    console.log("[Mock] getActiveRefund called");
    return {
        success: true,
        refund: MOCK_ACTIVE_REFUND_DETAILS,
        timestamp: new Date().toISOString()
    };
};
