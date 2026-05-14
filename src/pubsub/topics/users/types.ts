export * from "./set-active-user/types";
export * from "./get-active-user/types";
export * from "./user-created/types";
export * from "./user-updated/types";

import type { UserActiveSetPayload } from "./set-active-user/types";
import type { UserActiveGetPayload } from "./get-active-user/types";
import type { UserCreatedPayload } from "./user-created/types";
import type { UserUpdatedPayload } from "./user-updated/types";

export type UsersEventPayload = UserActiveSetPayload | UserActiveGetPayload | UserCreatedPayload | UserUpdatedPayload;

export type UsersEventType = "set-active-user" | "get-active-user" | "user-created" | "user-updated";
