export * from './attribute-created/types';
export * from './attribute-updated/types';
export * from './attribute-deleted/types';

import type { AttributeCreatedPayload } from './attribute-created/types';
import type { AttributeUpdatedPayload } from './attribute-updated/types';
import type { AttributeDeletedPayload } from './attribute-deleted/types';

export type AttributesEventPayload = AttributeCreatedPayload | AttributeUpdatedPayload | AttributeDeletedPayload;

export type AttributesEventType = 'attribute-created' | 'attribute-updated' | 'attribute-deleted';
