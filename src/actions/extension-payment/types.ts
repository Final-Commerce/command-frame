import { CFOrder } from "../../CommonTypes";
import type { CFTransitionResult } from "../../common-types/order-state";

/** Params for extension-initiated payments; host routes by `paymentType`. */
export interface ExtensionPaymentParams {
    paymentType: string;
    processor?: string;
    amount?: number;
    label?: string;
    referenceId?: string;
    extensionId?: string;
    metadata?: Record<string, unknown>;
    /** Override the fulfillment landing on full payment. Omitted: preserve advanced fulfillment, auto-fulfill from draft/pending/on_hold. */
    targetFulfillmentState?: string;
    /** EMV data when the underlying payment carries one (typed as `IntegrationEmvData` by the integration wrapper). */
    emvData?: unknown;
    /** Processor fee in minor units; recorded on the order's paymentMethod.processorFee. */
    processorFee?: number;
}

export interface ExtensionPaymentResponse {
    success: boolean;
    amount: number | null;
    paymentType: string;
    order: CFOrder | null;
    timestamp: string;
    /** Present when the state machine blocked or forced the transition. */
    transitionResult?: CFTransitionResult;
}

export type ExtensionPayment = (params?: ExtensionPaymentParams) => Promise<ExtensionPaymentResponse>;
