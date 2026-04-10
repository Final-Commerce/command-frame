import { MOCK_ACTIVE_REFUND_DETAILS } from "../../demo/database";
import { SetActiveRefund, SetActiveRefundParams, SetActiveRefundResponse } from "./types";

export const mockSetActiveRefund: SetActiveRefund = async (
    params?: SetActiveRefundParams
): Promise<SetActiveRefundResponse> => {
    console.log("[Mock] setActiveRefund called", params);
    if (!params?.orderId) {
        throw new Error("orderId is required");
    }
    return {
        success: true,
        refund: { ...MOCK_ACTIVE_REFUND_DETAILS, isRefund: true },
        timestamp: new Date().toISOString()
    };
};
