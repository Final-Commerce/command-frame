import type { ExtensionPaymentResponse } from "../extension-payment/types";

/**
 * Integration payment (e.g. Stripe-like) — always uses paymentType `"integration"` on the wire.
 * The extension processes the payment with its own provider, then reports the result here so
 * Render can record the transaction + order.
 *
 * Required fields (compile-time enforced by TS, runtime-enforced by the host handler):
 *   - `amount` — minor units of the captured amount
 *   - `emvData` — EMV tag string from the provider; stored on `paymentMethod.emv` exactly like card.
 *                 Required and non-nullable: if the integration doesn't produce EMV, use redeemPayment instead.
 */
export interface IntegrationPaymentParams {
    amount: number;
    emvData: string;
    /** Human-readable label (e.g. "Visa ****4242"); shown in the transaction list. */
    label?: string;
    /** Identifier of the extension making the call; audit/debug link. */
    extensionId?: string;
    /** Label/name of the integration (e.g. "Stripe", "AMP"). Stored on the order's paymentMethod.processor. */
    processor?: string;
    referenceId?: string;
    metadata?: Record<string, unknown>;
    /** Provider fee in minor units — stored on paymentMethod.processorFee. */
    processorFee?: number;
}

export type IntegrationPaymentResponse = ExtensionPaymentResponse;

export type IntegrationPayment = (params: IntegrationPaymentParams) => Promise<IntegrationPaymentResponse>;
