// Send SMS Types — text the customer their order/refund receipt.

import type { SendReceiptType } from "../send-email/types";

export type { SendReceiptType };

export interface SendSmsParams {
    /** Recipient phone in E.164 format (e.g. +15555550123). Defaults to the active customer's phone. */
    phone?: string;
    /** Order id to send the receipt for. Defaults to the active order. */
    orderId?: string;
    /** Refund id — required when `type` is 'refund'. */
    refundId?: string;
    /** 'order' (default) or 'refund'. */
    type?: SendReceiptType;
}

export interface SendSmsResponse {
    success: boolean;
    /** Always 'text' for this action. */
    channel: 'text';
    /** The phone the receipt was sent to (E.164). */
    phone: string;
    /** The order or refund id the receipt was sent for. */
    entityId: string;
    type: SendReceiptType;
    timestamp: string;
}

export type SendSms = (params?: SendSmsParams) => Promise<SendSmsResponse>;
