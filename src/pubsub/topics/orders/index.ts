/**
 * Orders Topic Definition
 * Defines the orders topic and its available event types
 */

import type { TopicDefinition } from "../../types";

export const ordersTopic: TopicDefinition = {
    id: "orders",
    name: "Orders",
    description: "Topic for order-related events",
    eventTypes: [
        {
            id: "order-created",
            name: "Order Created",
            description: "Published when a new order is created"
        },
        {
            id: "order-updated",
            name: "Order Updated",
            description: "Published when an order is updated"
        }
    ]
};

// Re-export types
export * from "./types";

