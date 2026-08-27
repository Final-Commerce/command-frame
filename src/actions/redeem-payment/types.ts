import type { ExtensionPaymentResponse } from "../extension-payment/types";

/**
 * Redeem (e.g. gift card) — always uses paymentType `"redeem"` on the wire.
 * `amount` is required so the persisted payment never silently falls back to the cart
 * total. The host handler also re-validates this at runtime to catch raw-postMessage callers.
 */
export interface RedeemPaymentParams {
    /** Amount in integer MINOR currency units (e.g. 1575 = $15.75). */
    amount: number;
    label?: string;
    extensionId?: string;
    processor?: string;
    referenceId?: string;
    metadata?: Record<string, unknown>;
    /** Override the fulfillment state the order lands in on full payment (validated against the fulfillment state machine; invalid values throw). Omitted: preserve advanced fulfillment, auto-fulfill from draft/pending/on_hold. */
    checkoutFulfillmentTarget?: string;
}

export type RedeemPaymentResponse = ExtensionPaymentResponse;

export type RedeemPayment = (params: RedeemPaymentParams) => Promise<RedeemPaymentResponse>;
