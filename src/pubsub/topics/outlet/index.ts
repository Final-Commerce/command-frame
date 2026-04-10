import type { TopicDefinition } from "../../types";

export const outletTopic: TopicDefinition = {
    id: "outlet",
    name: "Outlet",
    description: "Topic for active outlet context in the POS",
    eventTypes: [
        {
            id: "set-active-outlet",
            name: "Set Active Outlet",
            description: "Published when the active outlet is set"
        },
        {
            id: "get-active-outlet",
            name: "Get Active Outlet",
            description: "Published when the active outlet is published to listeners"
        }
    ]
};

export * from "./types";
