import type { TopicEvent } from '../../../types';

export interface AttributeDeletedPayload {
  attributeId: string;
}

export type AttributeDeletedEvent = TopicEvent<AttributeDeletedPayload>;
