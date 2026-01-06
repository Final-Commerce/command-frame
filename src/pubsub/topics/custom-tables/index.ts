/**
 * Custom Tables Topic Definition
 * Defines the custom tables topic and its available event types
 */

import type { TopicDefinition } from "../../types";

export const customTablesTopic: TopicDefinition = {
    id: "custom-tables",
    name: "Custom Tables",
    description: "Topic for custom table-related events",
    eventTypes: [
        {
            id: "row-created",
            name: "Row Created",
            description: "Fired when a new row is created in a custom table"
        },
        {
            id: "row-updated",
            name: "Row Updated",
            description: "Fired when a row is updated in a custom table"
        },
        {
            id: "row-deleted",
            name: "Row Deleted",
            description: "Fired when a row is deleted from a custom table"
        }
    ]
};

// Re-export types
export * from "./types";
