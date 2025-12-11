/**
 * Payments Topic Definition
 * Defines the payments topic and its available event types
 */

import type { TopicDefinition } from "../../types";

export const paymentsTopic: TopicDefinition = {
    id: "payments",
    name: "Payments",
    description: "Topic for payment-related events",
    eventTypes: [
        {
            id: "payment-done",
            name: "Payment Done",
            description: "Fired when a payment is successfully completed"
        },
        {
            id: "payment-err",
            name: "Payment Error",
            description: "Fired when a payment error occurs"
        }
    ]
};

// Re-export types
export * from "./types";

