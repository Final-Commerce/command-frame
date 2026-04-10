import { CFActiveStation } from "../../CommonTypes";

export interface GetActiveStationResponse {
    success: boolean;
    station: CFActiveStation | null;
    timestamp: string;
}

export type GetActiveStation = () => Promise<GetActiveStationResponse>;
