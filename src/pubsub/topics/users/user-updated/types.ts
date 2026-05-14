import type { CFActiveUser } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface UserUpdatedPayload {
    user: CFActiveUser;
}

export type UserUpdatedEvent = TopicEvent<UserUpdatedPayload>;
