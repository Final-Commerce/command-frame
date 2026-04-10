import type { TopicDefinition } from "../../types";

export const sessionTopic: TopicDefinition = {
    id: "session",
    name: "Session",
    description: "Topic for cash register session context",
    eventTypes: [
        {
            id: "set-active-session",
            name: "Set Active Session",
            description: "Published when the active register session is set"
        },
        {
            id: "get-active-session",
            name: "Get Active Session",
            description: "Published when the active session is published to listeners"
        }
    ]
};

export * from "./types";
