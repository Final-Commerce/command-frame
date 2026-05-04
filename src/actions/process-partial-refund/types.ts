import type { CFTransitionResult } from "../../common-types/order-state";

// Process Partial Refund Types
export interface ProcessPartialRefundParams {
    /** Optional refund reason. */
    reason?: string;
    /** Optional: specify which order to refund (sets it as active). */
    orderId?: string;
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
