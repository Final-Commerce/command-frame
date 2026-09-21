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
    /**
     * OPAQUE PROOF OF THIS PAYMENT, handed to the browser by the provider and to
     * nobody else. Pass it to the order-status read and the server verifies it
     * with the provider before believing a word of it.
     *
     * It is the only evidence of an outcome that exists outside the provider's
     * webhook, so it is what recovers an order whose confirmation never arrived.
     * Treat it as a credential: do not log it, do not put it in a URL you share.
     *
     * Absent when the provider reported no payment (see `resultCode`).
     */
    sessionResult?: string;
}

/**
 * Typed event for payment-completed
 */
export type PaymentCompletedEvent = TopicEvent<PaymentCompletedPayload>;
