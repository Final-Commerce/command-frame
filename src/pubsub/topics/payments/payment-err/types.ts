import type { TopicEvent } from "../../../types";

/**
 * Payload for payment-err event
 */
export interface PaymentErrPayload {
    error: string;
    errorCode?: string;
    paymentType?: string;
    amount?: string;
}

/**
 * Typed event for payment-err
 */
export type PaymentErrEvent = TopicEvent<PaymentErrPayload>;

