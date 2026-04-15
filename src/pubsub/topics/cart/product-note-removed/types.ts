import type { CFActiveProduct } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for product-note-removed event
 */
export interface ProductNoteRemovedPayload {
    product: CFActiveProduct;
    internalId?: string;
}

/**
 * Typed event for product-note-removed
 */
export type ProductNoteRemovedEvent = TopicEvent<ProductNoteRemovedPayload>;
