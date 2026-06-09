import type { ExtensionPaymentResponse } from "../extension-payment/types";

/**
 * Card display fields for an integration payment.
 *
 * Render JSON-serializes this object onto the order's `paymentMethod.emv` field;
 * the transactions list, split-payment refund modal, and receipt mapper parse it
 * back. Field names are translated to the platform's canonical EMV keys ("Brand",
 * "Cardholder Name", "Card Number", etc.) on the host before serialization — your
 * extension passes camelCase, the order's persisted shape is unchanged from the
 * native card flow.
 *
 * All fields are optional; the more you supply, the richer the receipt and the
 * transactions row will be. At minimum, supplying `brand` and `cardNumberLast4`
 * produces the typical "Visa **** **** **** 4242" row.
 */
export interface IntegrationEmvData {
    /** Card brand, e.g. "Visa", "MasterCard". → "Brand" */
    brand?: string;
    /** Cardholder name as printed on the card. → "Cardholder Name" */
    cardholderName?: string;
    /** Issuing country (ISO 3166-1 alpha-2), e.g. "US". → "Country" */
    country?: string;
    /** Display expiry, e.g. "12/26". → "Expiry date" */
    expiryDate?: string;
    /** Issuer / bank name. → "Issuer" */
    issuer?: string;
    /** Last 4 digits of the card. Render masks to "**** **** **** XXXX" before display. → "Card Number" */
    cardNumberLast4?: string;
}

/**
 * Integration payment (e.g. Stripe-like) — always uses paymentType `"integration"` on the wire.
 * The extension processes the payment with its own provider, then reports the result here so
 * Render can record the transaction + order.
 *
 * Required fields (compile-time enforced by TS, runtime-enforced by the host handler):
 *   - `amount` — minor units of the captured amount
 *   - `emvData` — typed card display fields; the host maps + JSON-serializes to `paymentMethod.emv`
 *                 (same persisted shape as the native card flow). Required: if the integration
 *                 doesn't produce card data, use redeemPayment instead.
 */
export interface IntegrationPaymentParams {
    amount: number;
    emvData: IntegrationEmvData;
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
