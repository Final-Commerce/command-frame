import type { CFActiveProduct } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for product-updated event
 */
export interface ProductUpdatedPayload {
    product: CFActiveProduct;
    previousQuantity: number;
    newQuantity: number;
}

/**
 * Typed event for product-updated
 */
export type ProductUpdatedEvent = TopicEvent<ProductUpdatedPayload>;

