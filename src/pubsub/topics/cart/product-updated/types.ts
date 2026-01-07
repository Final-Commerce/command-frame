import type { CFActiveProduct } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for cart product-updated event
 */
export interface CartProductUpdatedPayload {
    product: CFActiveProduct;
    previousQuantity: number;
    newQuantity: number;
}

/**
 * Typed event for cart product-updated
 */
export type CartProductUpdatedEvent = TopicEvent<CartProductUpdatedPayload>;

