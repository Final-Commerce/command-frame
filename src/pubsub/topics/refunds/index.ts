/**
 * Refunds Topic Definition
 * Defines the refunds topic and its available event types
 */

import type { TopicDefinition } from "../../types";

export const refundsTopic: TopicDefinition = {
    id: "refunds",
    name: "Refunds",
    description: "Topic for refund-related events",
    eventTypes: [
        {
            id: "refund-created",
            name: "Refund Created",
            description: "Published when a new refund is created"
        },
        {
            id: "refund-updated",
            name: "Refund Updated",
            description: "Published when a refund is updated"
        },
        {
            id: "set-active-refund",
            name: "Set Active Refund",
            description: "Published when active refund details change in POS state"
        },
        {
            id: "get-active-refund",
            name: "Get Active Refund",
            description: "Published when refund details are published to listeners"
        }
    ]
};

// Re-export types
export * from "./types";

