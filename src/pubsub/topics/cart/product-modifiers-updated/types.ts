import type { CFActiveProduct, CFModifierSelection } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for product-modifiers-updated event (FT-0010) — fired when a cart
 * line's modifier selections are replaced via setProductModifierSelections.
 */
export interface ProductModifiersUpdatedPayload {
    product: CFActiveProduct;
    internalId?: string;
    /** The line's complete new answers (full replacement). */
    selections: CFModifierSelection[];
}

/**
 * Typed event for product-modifiers-updated
 */
export type ProductModifiersUpdatedEvent = TopicEvent<ProductModifiersUpdatedPayload>;
