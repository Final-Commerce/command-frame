import type { CFActiveUser } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface UserActiveGetPayload {
    user: CFActiveUser | null;
}

export type UserActiveGetEvent = TopicEvent<UserActiveGetPayload>;
