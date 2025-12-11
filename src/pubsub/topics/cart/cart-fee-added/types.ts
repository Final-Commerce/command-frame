import type { CFCustomFee } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for cart-fee-added event
 */
export interface CartFeeAddedPayload {
    fee: CFCustomFee;
}

/**
 * Typed event for cart-fee-added
 */
export type CartFeeAddedEvent = TopicEvent<CartFeeAddedPayload>;

