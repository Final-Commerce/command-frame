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
        },
        {
            id: "user-created",
            name: "User Created",
            description: "Published when a new user record is synced/created in the database"
        },
        {
            id: "user-updated",
            name: "User Updated",
            description: "Published when any user record is synced/updated in the database"
        }
    ]
};

export * from "./types";
