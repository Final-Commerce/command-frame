import type { CFSession } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface SessionActiveSetPayload {
    session: CFSession;
}

export type SessionActiveSetEvent = TopicEvent<SessionActiveSetPayload>;
