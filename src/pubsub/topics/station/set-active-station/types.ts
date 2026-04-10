import type { CFActiveStation } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface StationActiveSetPayload {
    station: CFActiveStation;
}

export type StationActiveSetEvent = TopicEvent<StationActiveSetPayload>;
