import type { CFCategory } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface CategoryUpdatedPayload {
    category: CFCategory;
}

export type CategoryUpdatedEvent = TopicEvent<CategoryUpdatedPayload>;
