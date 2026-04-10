export * from "./set-active-station/types";
export * from "./get-active-station/types";

import type { StationActiveSetPayload } from "./set-active-station/types";
import type { StationActiveGetPayload } from "./get-active-station/types";

export type StationEventPayload = StationActiveSetPayload | StationActiveGetPayload;

export type StationEventType = "set-active-station" | "get-active-station";
