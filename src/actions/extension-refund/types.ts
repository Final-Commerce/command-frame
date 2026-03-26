/**
 * Host-initiated refund request for extension-controlled payments (e.g. redeem / gift card).
 * The host (Render) postMessages the iframe; the extension performs the provider refund and replies.
 */

/**
 * Parameters sent from host to extension for a refund.
 *
 * **`amount` uses major currency units** (e.g. dollars), consistent with the string amount
 * passed through `sendRefundPaymentRequest` in Render (parsed with `parseFloat` / `+amount`).
 */
export interface ExtensionRefundParams {
    /** e.g. `"redeem"` — matches order paymentMethods[].paymentType */
    paymentType: string;
    processor?: string;
    /** Major currency units (same as refund flow amount string, not cents). */
    amount: number;
    /** Local sale transaction id (Mongo-style id from paymentMethods[].transactionId). */
    saleId: string;
    orderId?: string;
    referenceId?: string;
    metadata?: Record<string, unknown>;
}

/**
 * Business result from the extension after attempting the refund.
 * Transport success/failure uses {@link import("../../client").PostMessageResponse}.
 */
export interface ExtensionRefundResponse {
    success: boolean;
    error?: string;
    /** Provider/extension reference for the refund transaction, stored in local DB paymentData when present. */
    extensionTransactionId?: string;
}
