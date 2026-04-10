import type { CFActiveUser } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface UserActiveSetPayload {
    user: CFActiveUser;
}

export type UserActiveSetEvent = TopicEvent<UserActiveSetPayload>;
