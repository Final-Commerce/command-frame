import type { TopicDefinition } from "../../types";

export const usersTopic: TopicDefinition = {
    id: "users",
    name: "Users",
    description: "Topic for active POS user (employee) context",
    eventTypes: [
        {
            id: "set-active-user",
            name: "Set Active User",
            description: "Published when the active user is set"
        },
        {
            id: "get-active-user",
            name: "Get Active User",
            description: "Published when the active user is published to listeners"
        }
    ]
};

export * from "./types";
