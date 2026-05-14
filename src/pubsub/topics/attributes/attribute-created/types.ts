import type { CFAttribute } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface AttributeCreatedPayload {
    attribute: CFAttribute;
}

export type AttributeCreatedEvent = TopicEvent<AttributeCreatedPayload>;
