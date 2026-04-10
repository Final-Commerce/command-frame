import type { CFActiveOutlet } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface OutletActiveSetPayload {
    outlet: CFActiveOutlet;
}

export type OutletActiveSetEvent = TopicEvent<OutletActiveSetPayload>;
