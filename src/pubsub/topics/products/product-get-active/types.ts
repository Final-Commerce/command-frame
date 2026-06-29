import type { CFActiveProduct } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for product-get-active event.
 *
 * `product` is nullable: the host publishes this event unconditionally, including
 * with `null` when there is no active selection (e.g. after the active product is
 * cleared). Subscribers must handle the null case. [FI-6491]
 */
export interface ProductGetActivePayload {
    product: CFActiveProduct | null;
}

/**
 * Typed event for product-get-active
 */
export type ProductGetActiveEvent = TopicEvent<ProductGetActivePayload>;
