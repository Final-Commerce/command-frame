import type { CFActiveStation } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface StationActiveGetPayload {
    station: CFActiveStation | null;
}

export type StationActiveGetEvent = TopicEvent<StationActiveGetPayload>;
