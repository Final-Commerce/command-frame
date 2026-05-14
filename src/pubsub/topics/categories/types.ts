export * from "./category-created/types";
export * from "./category-updated/types";

import type { CategoryCreatedPayload } from "./category-created/types";
import type { CategoryUpdatedPayload } from "./category-updated/types";

export type CategoriesEventPayload = CategoryCreatedPayload | CategoryUpdatedPayload;

export type CategoriesEventType = "category-created" | "category-updated";
