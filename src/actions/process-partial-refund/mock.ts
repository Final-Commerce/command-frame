import { ProcessPartialRefund, ProcessPartialRefundParams, ProcessPartialRefundResponse } from "./types";

export const mockProcessPartialRefund: ProcessPartialRefund = async (params?: ProcessPartialRefundParams): Promise<ProcessPartialRefundResponse> => {
    // The mock has no split-payment modal, so `openUI` (default true on the real
    // command) is inert here — the shape is accepted and echoed, nothing else.
    console.log("[Mock] processPartialRefund called", { ...params, openUI: params?.openUI ?? true });

    return {
        success: true,
        refundId: 'mock_refund_' + Date.now(),
        timestamp: new Date().toISOString()
    };
};
