export * from "./attribute-created/types";
export * from "./attribute-updated/types";

import type { AttributeCreatedPayload } from "./attribute-created/types";
import type { AttributeUpdatedPayload } from "./attribute-updated/types";

export type AttributesEventPayload = AttributeCreatedPayload | AttributeUpdatedPayload;

export type AttributesEventType = "attribute-created" | "attribute-updated";
