/**
 * Customers Topic Definition
 * Defines the customers topic and its available event types
 */

import type { TopicDefinition } from "../../types";

export const customersTopic: TopicDefinition = {
    id: "customers",
    name: "Customers",
    description: "Topic for customer-related events",
    eventTypes: [
        {
            id: "customer-created",
            name: "Customer Created",
            description: "Published when a new customer is created"
        },
        {
            id: "customer-updated",
            name: "Customer Updated",
            description: "Published when a customer is updated"
        },
        {
            id: "customer-note-added",
            name: "Customer Note Added",
            description: "Published when a note is added to a customer"
        },
        {
            id: "customer-note-deleted",
            name: "Customer Note Deleted",
            description: "Published when a note is deleted from a customer"
        },
        {
            id: "customer-assigned",
            name: "Customer Assigned",
            description: "Published when a customer is assigned to the cart"
        },
        {
            id: "customer-unassigned",
            name: "Customer Unassigned",
            description: "Published when a customer is unassigned from the cart"
        }
    ]
};

// Re-export types
export * from "./types";

