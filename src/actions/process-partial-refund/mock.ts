import { ProcessPartialRefund, ProcessPartialRefundParams, ProcessPartialRefundResponse } from "./types";

export const mockProcessPartialRefund: ProcessPartialRefund = async (params?: ProcessPartialRefundParams): Promise<ProcessPartialRefundResponse> => {
    // The mock has no split-payment modal or order engine, so `openUI` (default
    // true on the real command), `legs` (the headless per-tender allocation), a
    // per-leg `giftCard` destination (mixed returns) and the top-level `giftCard`
    // routing are all inert here — the shape is accepted and echoed, nothing
    // else. No gift card is credited.
    //
    // The one rule worth mirroring is the mutual exclusion, so a flow built
    // against the mock fails the same way it will against the runtime.
    if (params?.legs && params?.giftCard) {
        throw new Error(
            'refund.giftCardAndLegs: pass either `legs` (you allocate) or `giftCard` (the engine allocates), not both',
        );
    }

    console.log("[Mock] processPartialRefund called", {
        ...params,
        openUI: params?.openUI ?? true,
        legs: params?.legs ?? null,
        giftCard: params?.giftCard ?? null,
    });

    return {
        success: true,
        refundId: 'mock_refund_' + Date.now(),
        timestamp: new Date().toISOString()
    };
};
