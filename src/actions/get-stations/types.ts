import { CFActiveStation } from "../../CommonTypes";

export interface GetStationsParams {
    outletId?: string;
}

export interface GetStationsResponse {
    stations: CFActiveStation[];
    timestamp: string;
}

export type GetStations = (params?: GetStationsParams) => Promise<GetStationsResponse>;
