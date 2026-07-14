import { CFOrder } from "../../CommonTypes";
import type { CFTransitionResult } from "../../common-types/order-state";

/** Params for extension-initiated payments; host routes by `paymentType`. */
export interface ExtensionPaymentParams {
    paymentType: string;
    processor?: string;
    /**
     * The amount to pay with this tender, in integer MINOR currency units
     * (e.g. 1575 = $15.75). Required. Semantics against the cart's balance
     * due: missing → error; less than balance → partial payment (fixed
     * split-payment leg); equal → full payment; more → error.
     */
    amount: number;
    label?: string;
    referenceId?: string;
    extensionId?: string;
    metadata?: Record<string, unknown>;
    /** Override the fulfillment state after full payment. Render resolves the cascade. */
    checkoutFulfillmentTarget?: string;
    /** EMV data when the underlying payment carries one (typed as `IntegrationEmvData` by the integration wrapper). */
    emvData?: unknown;
    /** Processor fee in integer MINOR currency units; recorded on the order's paymentMethod.processorFee. */
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
