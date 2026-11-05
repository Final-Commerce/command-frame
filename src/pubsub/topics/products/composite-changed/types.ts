import type { TopicEvent } from '../../../types';

/**
 * Payload for composite-changed (FT-83): a part or item of a composite arrived. A save replaces all of a composite's
 * parts and items at once (old rows come as `isDeleted: true`, new ones with new ids), so one save fires this many
 * times — debounce, then re-ask `getProducts`; never patch `product.composite` from the row.
 */
export interface CompositeChangedPayload {
  compositeRow: { _id: string; compositeProductId: string; isDeleted?: boolean };
}

/**
 * Typed event for composite-changed
 */
export type CompositeChangedEvent = TopicEvent<CompositeChangedPayload>;
