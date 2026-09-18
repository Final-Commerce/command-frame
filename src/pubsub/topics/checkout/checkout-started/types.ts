import type { TopicEvent } from "../../../types";

/**
 * Payload for checkout-started event
 *
 * The order EXISTS and is unpaid. `serverTotal` is the server's own price for
 * the cart, in integer minor units — the browser never sends a price, so this
 * is the first and only authoritative total.
 */
export interface CheckoutStartedPayload {
    orderId: string;
    receiptId: string;
    serverTotal: number;
    currency: string;
    /**
     * `ready` — the payment fields are mounted and the shopper can pay.
     * `unavailable` — the order exists but no payment could be started, so the
     * shopper has NOT been charged.
     */
    paymentStatus: "ready" | "unavailable";
    /** One-time password for reading this order back. Returned only on the first create. */
    orderPassword?: string;
}

/**
 * Typed event for checkout-started
 */
export type CheckoutStartedEvent = TopicEvent<CheckoutStartedPayload>;
