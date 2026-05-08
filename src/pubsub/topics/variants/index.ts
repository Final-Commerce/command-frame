import type { TopicDefinition } from "../../types";

export const variantsTopic: TopicDefinition = {
    id: "variants",
    name: "Variants",
    description: "Topic for product variant changes synced from the database",
    eventTypes: [
        {
            id: "variant-created",
            name: "Variant Created",
            description: "Published when a new product variant is synced/created"
        },
        {
            id: "variant-updated",
            name: "Variant Updated",
            description: "Published when a product variant is synced/updated"
        }
    ]
};

export * from "./types";
