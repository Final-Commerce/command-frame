export * from './category-created/types';
export * from './category-updated/types';
export * from './category-deleted/types';

import type { CategoryCreatedPayload } from './category-created/types';
import type { CategoryUpdatedPayload } from './category-updated/types';
import type { CategoryDeletedPayload } from './category-deleted/types';

export type CategoriesEventPayload = CategoryCreatedPayload | CategoryUpdatedPayload | CategoryDeletedPayload;

export type CategoriesEventType = 'category-created' | 'category-updated' | 'category-deleted';
