/**
 * Cart Topic Definition
 * Defines the cart topic and its available event types
 */

import type { TopicDefinition } from "../../types";

export const cartTopic: TopicDefinition = {
    id: "cart",
    name: "Cart",
    description: "Topic for cart-related events",
    eventTypes: [
        {
            id: "cart-created",
            name: "Cart Created",
            description: "Fired when a new cart is created"
        },
        {
            id: "customer-assigned",
            name: "Customer Assigned",
            description: "Fired when a customer is assigned to the cart"
        },
        {
            id: "product-added",
            name: "Product Added",
            description: "Fired when a product is added to the cart"
        },
        {
            id: "product-deleted",
            name: "Product Deleted",
            description: "Fired when a product is removed from the cart"
        },
        {
            id: "cart-discount-added",
            name: "Cart Discount Added",
            description: "Fired when a discount is added to the cart"
        },
        {
            id: "cart-discount-removed",
            name: "Cart Discount Removed",
            description: "Fired when a discount is removed from the cart"
        },
        {
            id: "cart-fee-added",
            name: "Cart Fee Added",
            description: "Fired when a fee is added to the cart"
        },
        {
            id: "cart-fee-removed",
            name: "Cart Fee Removed",
            description: "Fired when a fee is removed from the cart"
        }
    ]
};

// Re-export types
export * from "./types";

