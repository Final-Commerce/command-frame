export * from './variant-created/types';
export * from './variant-updated/types';
export * from './variant-deleted/types';

import type { VariantCreatedPayload } from './variant-created/types';
import type { VariantUpdatedPayload } from './variant-updated/types';
import type { VariantDeletedPayload } from './variant-deleted/types';

export type VariantsEventPayload = VariantCreatedPayload | VariantUpdatedPayload | VariantDeletedPayload;

export type VariantsEventType = 'variant-created' | 'variant-updated' | 'variant-deleted';
