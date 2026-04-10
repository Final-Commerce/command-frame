export * from "./set-active-user/types";
export * from "./get-active-user/types";

import type { UserActiveSetPayload } from "./set-active-user/types";
import type { UserActiveGetPayload } from "./get-active-user/types";

export type UsersEventPayload = UserActiveSetPayload | UserActiveGetPayload;

export type UsersEventType = "set-active-user" | "get-active-user";
