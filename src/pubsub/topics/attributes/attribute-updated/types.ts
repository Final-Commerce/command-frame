import type { CFAttribute } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface AttributeUpdatedPayload {
    attribute: CFAttribute;
}

export type AttributeUpdatedEvent = TopicEvent<AttributeUpdatedPayload>;
