export * from "./variant-created/types";
export * from "./variant-updated/types";

import type { VariantCreatedPayload } from "./variant-created/types";
import type { VariantUpdatedPayload } from "./variant-updated/types";

export type VariantsEventPayload = VariantCreatedPayload | VariantUpdatedPayload;

export type VariantsEventType = "variant-created" | "variant-updated";
