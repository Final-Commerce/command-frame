import type { CFSession } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface SessionActiveGetPayload {
    session: CFSession | null;
}

export type SessionActiveGetEvent = TopicEvent<SessionActiveGetPayload>;
