export * from "./set-active-session/types";
export * from "./get-active-session/types";

import type { SessionActiveSetPayload } from "./set-active-session/types";
import type { SessionActiveGetPayload } from "./get-active-session/types";

export type SessionEventPayload = SessionActiveSetPayload | SessionActiveGetPayload;

export type SessionEventType = "set-active-session" | "get-active-session";
