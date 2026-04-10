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
        },
        {
            id: "set-active-order",
            name: "Set Active Order",
            description: "Published when the active order is set in POS state"
        },
        {
            id: "get-active-order",
            name: "Get Active Order",
            description: "Published when the active order is retrieved for listeners"
        }
    ]
};

// Re-export types
export * from "./types";

