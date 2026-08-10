// Send Email Types — email the customer their order/refund receipt.

/**
 * Which receipt to send: a finalized order (default) or a refund.
 * Values MUST stay in lockstep with `ReceiptType` in `@final-commerce/common` (used by hub-api);
 * this SDK intentionally has no dependency on that package, so the literal is duplicated here.
 */
export type SendReceiptType = 'order' | 'refund';

export interface SendEmailParams {
    /** Recipient email. Defaults to the active customer's email. */
    email?: string;
    /** Order id to send the receipt for. Defaults to the active order. */
    orderId?: string;
    /** Refund id — required when `type` is 'refund'. */
    refundId?: string;
    /** 'order' (default) or 'refund'. */
    type?: SendReceiptType;
}

export interface SendEmailResponse {
    success: boolean;
    /** Always 'email' for this action. */
    channel: 'email';
    /** The email the receipt was sent to. */
    email: string;
    /** The order or refund id the receipt was sent for. */
    entityId: string;
    type: SendReceiptType;
    timestamp: string;
}

export type SendEmail = (params?: SendEmailParams) => Promise<SendEmailResponse>;
