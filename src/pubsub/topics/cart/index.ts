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
            description: "Published when a new cart is created"
        },
        {
            id: "customer-assigned",
            name: "Customer Assigned",
            description: "Published when a customer is assigned to the cart"
        },
        {
            id: "customer-unassigned",
            name: "Customer Unassigned",
            description: "Published when a customer is removed from the cart"
        },
        {
            id: "product-added",
            name: "Product Added",
            description: "Published when a product is added to the cart"
        },
        {
            id: "product-deleted",
            name: "Product Deleted",
            description: "Published when a product is removed from the cart"
        },
        {
            id: "product-updated",
            name: "Product Updated",
            description: "Published when a product's quantity is updated in the cart"
        },
        {
            id: "cart-discount-added",
            name: "Cart Discount Added",
            description: "Published when a discount is added to the cart"
        },
        {
            id: "cart-discount-removed",
            name: "Cart Discount Removed",
            description: "Published when a discount is removed from the cart"
        },
        {
            id: "cart-fee-added",
            name: "Cart Fee Added",
            description: "Published when a fee is added to the cart"
        },
        {
            id: "cart-fee-removed",
            name: "Cart Fee Removed",
            description: "Published when a fee is removed from the cart"
        },
        {
            id: "product-discount-added",
            name: "Product Discount Added",
            description: "Published when a discount is added to a product in the cart"
        },
        {
            id: "product-discount-removed",
            name: "Product Discount Removed",
            description: "Published when a discount is removed from a product in the cart"
        },
        {
            id: "product-fee-added",
            name: "Product Fee Added",
            description: "Published when a fee is added to a product in the cart"
        },
        {
            id: "product-fee-removed",
            name: "Product Fee Removed",
            description: "Published when a fee is removed from a product in the cart"
        },
        {
            id: "product-note-added",
            name: "Product Note Added",
            description: "Published when a note is added to a product in the cart"
        },
        {
            id: "product-note-removed",
            name: "Product Note Removed",
            description: "Published when a note is removed from a product in the cart"
        }
    ]
};

// Re-export types
export * from "./types";

