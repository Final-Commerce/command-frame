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
            description: "Published when a new product is synced/created"
        },
        {
            id: "product-updated",
            name: "Product Updated",
            description: "Published when a product is synced/updated"
        },
        {
            id: "inventory-adjusted",
            name: "Inventory Adjusted",
            description: "Published when a variant's inventory stock is manually adjusted"
        },
        {
            id: "inventory-updated",
            name: "Inventory Updated",
            description: "Published when a variant's inventory stock changes (e.g. after a sale or restock)"
        }
    ]
};

// Re-export types
export * from "./types";

