import type { TopicEvent } from "../../../types";

/**
 * Payload for payment-completed event
 *
 * THIS IS NOT SETTLEMENT. It reports that the SHOPPER'S side finished —
 * `resultCode` is the provider's own outcome, typically `Authorised`. The money
 * is confirmed by the provider's capture webhook reaching the backend, out of
 * band and after this page is done, so this event cannot and does not claim it.
 */
export interface PaymentCompletedPayload {
    orderId: string;
    receiptId: string;
    /** The provider's result code, e.g. `Authorised`. */
    resultCode: string;
}

/**
 * Typed event for payment-completed
 */
export type PaymentCompletedEvent = TopicEvent<PaymentCompletedPayload>;
