import type { TopicEvent } from '../../../types';

export interface VariantDeletedPayload {
  productId: string;
  variantIds: string[];
}

export type VariantDeletedEvent = TopicEvent<VariantDeletedPayload>;
