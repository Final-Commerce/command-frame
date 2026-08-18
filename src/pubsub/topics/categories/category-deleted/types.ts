import type { TopicEvent } from '../../../types';

export interface CategoryDeletedPayload {
  categoryId: string;
}

export type CategoryDeletedEvent = TopicEvent<CategoryDeletedPayload>;
