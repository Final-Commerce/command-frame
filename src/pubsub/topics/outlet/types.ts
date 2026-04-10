export * from "./set-active-outlet/types";
export * from "./get-active-outlet/types";

import type { OutletActiveSetPayload } from "./set-active-outlet/types";
import type { OutletActiveGetPayload } from "./get-active-outlet/types";

export type OutletEventPayload = OutletActiveSetPayload | OutletActiveGetPayload;

export type OutletEventType = "set-active-outlet" | "get-active-outlet";
