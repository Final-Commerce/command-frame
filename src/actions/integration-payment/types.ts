import type { ExtensionPaymentResponse } from "../extension-payment/types";

/** Integration (e.g. Stripe-style terminal) payment — always uses paymentType `"integration"` on the wire. */
export interface IntegrationPaymentParams {
    amount?: number;
    processor?: string;
    label?: string;
    referenceId?: string;
    extensionId?: string;
    metadata?: Record<string, unknown>;
    /** EMV tag string from the integration terminal; forwarded to the order PaymentMethod's `emv`. */
    emvData?: string;
    /** Processor fee for the integration payment; forwarded to the order PaymentMethod's `processorFee`. */
    processorFee?: number;
}

export type IntegrationPaymentResponse = ExtensionPaymentResponse;

export type IntegrationPayment = (params?: IntegrationPaymentParams) => Promise<IntegrationPaymentResponse>;
