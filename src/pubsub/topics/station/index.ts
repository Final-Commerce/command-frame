import type { TopicDefinition } from "../../types";

export const stationTopic: TopicDefinition = {
    id: "station",
    name: "Station",
    description: "Topic for active station context in the POS",
    eventTypes: [
        {
            id: "set-active-station",
            name: "Set Active Station",
            description: "Published when the active station is set"
        },
        {
            id: "get-active-station",
            name: "Get Active Station",
            description: "Published when the active station is published to listeners"
        }
    ]
};

export * from "./types";
