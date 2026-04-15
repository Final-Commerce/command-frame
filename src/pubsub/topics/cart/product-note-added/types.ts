import type { CFActiveProduct } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for product-note-added event
 */
export interface ProductNoteAddedPayload {
    product: CFActiveProduct;
    internalId?: string;
    note: string;
}

/**
 * Typed event for product-note-added
 */
export type ProductNoteAddedEvent = TopicEvent<ProductNoteAddedPayload>;
