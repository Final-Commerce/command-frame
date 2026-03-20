import type { ExtensionPaymentResponse } from "../extension-payment/types";

/** Redeem (e.g. gift card) — always uses paymentType `"redeem"` on the wire. */
export interface RedeemPaymentParams {
    amount?: number;
    processor?: string;
    label?: string;
    referenceId?: string;
    extensionId?: string;
    metadata?: Record<string, unknown>;
}

export type RedeemPaymentResponse = ExtensionPaymentResponse;

export type RedeemPayment = (params?: RedeemPaymentParams) => Promise<RedeemPaymentResponse>;
