import type { TopicEvent } from "../../../types";

/**
 * Payload for payment-failed event
 *
 * ONE DECLINED ATTEMPT, NOT A DEAD CHECKOUT. The order and the mounted payment
 * fields both survive, so the shopper can try another card without the page
 * starting a new checkout.
 */
export interface PaymentFailedPayload {
    orderId: string;
    receiptId: string;
    /** The provider's result code, e.g. `Refused`, or an error name. */
    resultCode: string;
    /** Present when the failure carried a message worth showing. */
    message?: string;
}

/**
 * Typed event for payment-failed
 */
export type PaymentFailedEvent = TopicEvent<PaymentFailedPayload>;
