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
            id: "set-active-product",
            name: "Set Active Product",
            description: "Published when a product is set as the active product"
        },
        {
            id: "get-active-product",
            name: "Get Active Product",
            description: "Published when a product is retrieved as the active product"
        }
    ]
};

// Re-export types
export * from "./types";

