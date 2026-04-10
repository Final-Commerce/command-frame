import type { CFActiveOutlet } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface OutletActiveGetPayload {
    outlet: CFActiveOutlet | null;
}

export type OutletActiveGetEvent = TopicEvent<OutletActiveGetPayload>;
