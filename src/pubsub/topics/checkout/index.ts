/**
 * Checkout Topic Definition
 * Defines the checkout topic and its available event types
 */

import type { TopicDefinition } from "../../types";

export const checkoutTopic: TopicDefinition = {
    id: "checkout",
    name: "Checkout",
    description: "Topic for online (website) checkout events",
    eventTypes: [
        {
            id: "checkout-started",
            name: "Checkout Started",
            description: "Published when the order has been created and the payment fields are mounted"
        },
        {
            id: "payment-completed",
            name: "Payment Completed",
            description: "Published when the shopper's payment succeeds on their side (authorisation, not settlement)"
        },
        {
            id: "payment-failed",
            name: "Payment Failed",
            description: "Published when a payment attempt is refused or errors; the shopper can retry"
        }
    ]
};

// Re-export types
export * from "./types";
