import type { CFProductVariant } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface VariantCreatedPayload {
    variant: CFProductVariant;
}

export type VariantCreatedEvent = TopicEvent<VariantCreatedPayload>;
