import type { ExtensionPaymentResponse } from "../extension-payment/types";

/**
 * Redeem (e.g. gift card) — always uses paymentType `"redeem"` on the wire.
 * `amount` is required so the persisted payment never silently falls back to the cart
 * total. The host handler also re-validates this at runtime to catch raw-postMessage callers.
 */
export interface RedeemPaymentParams {
    amount: number;
    label?: string;
    extensionId?: string;
    processor?: string;
    referenceId?: string;
    metadata?: Record<string, unknown>;
}

export type RedeemPaymentResponse = ExtensionPaymentResponse;

export type RedeemPayment = (params: RedeemPaymentParams) => Promise<RedeemPaymentResponse>;
