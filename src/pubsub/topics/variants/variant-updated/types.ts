import type { CFProductVariant } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface VariantUpdatedPayload {
    variant: CFProductVariant;
}

export type VariantUpdatedEvent = TopicEvent<VariantUpdatedPayload>;
