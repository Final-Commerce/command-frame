import { CFActiveStation } from "../../CommonTypes";

export interface SetActiveStationParams {
    stationId: string;
}

export interface SetActiveStationResponse {
    success: boolean;
    station: CFActiveStation;
    timestamp: string;
}

export type SetActiveStation = (params?: SetActiveStationParams) => Promise<SetActiveStationResponse>;
