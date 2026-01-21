/**
 * Print Topic Definition
 * Defines the print topic and its available event types
 */

import type { TopicDefinition } from "../../types";

export const printTopic: TopicDefinition = {
    id: "print",
    name: "Print",
    description: "Topic for print-related events",
    eventTypes: [
        {
            id: "print-started",
            name: "Print Started",
            description: "Published when a print action is initiated"
        },
        {
            id: "print-completed",
            name: "Print Completed",
            description: "Published when a print action completes successfully"
        },
        {
            id: "print-error",
            name: "Print Error",
            description: "Published when a print action encounters an error"
        }
    ]
};

// Re-export types
export * from "./types";
