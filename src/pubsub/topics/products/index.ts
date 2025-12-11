/**
 * Products Topic Definition
 * Defines the products topic and its available event types
 */

import type { TopicDefinition } from "../../types";

export const productsTopic: TopicDefinition = {
    id: "products",
    name: "Products",
    description: "Topic for product-related events",
    eventTypes: [
        {
            id: "product-created",
            name: "Product Created",
            description: "Fired when a new product is synced/created"
        },
        {
            id: "product-updated",
            name: "Product Updated",
            description: "Fired when a product is synced/updated"
        }
    ]
};

// Re-export types
export * from "./types";

