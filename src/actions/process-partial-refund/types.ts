import type { CFTransitionResult } from "../../common-types/order-state";

// Process Partial Refund Types
export interface ProcessPartialRefundParams {
    /** Optional refund reason. */
    reason?: string;
    /** Optional: specify which order to refund (sets it as active). */
    orderId?: string;
    /**
     * Controls the refund UI for a MULTI-TENDER order (one paid across more
     * than one payment method). Defaults to `true`.
     *
     * - `true` (default, back-compat): the POS raises its split-payment refund
     *   modal so the cashier allocates the refund across the original payment
     *   sources; `processPartialRefund` returns without committing and the
     *   modal drives the commit.
     * - `false`: no modal is raised — the refund is committed headlessly
     *   against the planner's default proportional allocation across those
     *   sources (all cash-rounding invariants preserved). Use this when your
     *   flow renders its own refund UI and needs a fully headless multi-tender
     *   partial refund.
     *
     * Has no effect on single-tender orders (already headless — there is
     * nothing to allocate).
     */
    openUI?: boolean;
    /** Optional items to refund. */
    items?: {
        /** internalId or variantId or customSaleId. */
        itemKey: string;
        quantity: number;
        type?: 'product' | 'customSale' | 'fee' | 'tip'; // Optional type hint
    }[];
}

export interface ProcessPartialRefundResponse {
    success: boolean;
    refundId: string;
    timestamp: string;
    /** Present when the state machine blocked or forced the transition. */
    transitionResult?: CFTransitionResult;
}

export type ProcessPartialRefund = (params?: ProcessPartialRefundParams) => Promise<ProcessPartialRefundResponse>;
