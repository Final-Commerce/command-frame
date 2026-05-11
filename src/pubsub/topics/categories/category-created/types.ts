import type { CFCategory } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface CategoryCreatedPayload {
    category: CFCategory;
}

export type CategoryCreatedEvent = TopicEvent<CategoryCreatedPayload>;
