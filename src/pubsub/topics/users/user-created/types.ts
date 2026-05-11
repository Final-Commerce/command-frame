import type { CFActiveUser } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface UserCreatedPayload {
    user: CFActiveUser;
}

export type UserCreatedEvent = TopicEvent<UserCreatedPayload>;
