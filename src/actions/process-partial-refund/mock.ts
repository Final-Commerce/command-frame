import { ProcessPartialRefund, ProcessPartialRefundParams, ProcessPartialRefundResponse } from "./types";

export const mockProcessPartialRefund: ProcessPartialRefund = async (params?: ProcessPartialRefundParams): Promise<ProcessPartialRefundResponse> => {
    // The mock has no split-payment modal or order engine, so `openUI` (default
    // true on the real command), `legs` (the headless per-tender allocation) and
    // any per-leg `giftCard` destination (mixed returns) are inert here — the
    // shape is accepted and echoed, nothing else. No gift card is credited.
    console.log("[Mock] processPartialRefund called", {
        ...params,
        openUI: params?.openUI ?? true,
        legs: params?.legs ?? null,
    });

    return {
        success: true,
        refundId: 'mock_refund_' + Date.now(),
        timestamp: new Date().toISOString()
    };
};
