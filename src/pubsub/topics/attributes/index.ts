import type { TopicDefinition } from "../../types";

export const attributesTopic: TopicDefinition = {
    id: "attributes",
    name: "Attributes",
    description: "Topic for product attribute definition changes synced from the database",
    eventTypes: [
        {
            id: "attribute-created",
            name: "Attribute Created",
            description: "Published when a new attribute definition is synced/created"
        },
        {
            id: "attribute-updated",
            name: "Attribute Updated",
            description: "Published when an attribute definition is synced/updated"
        }
    ]
};

export * from "./types";
