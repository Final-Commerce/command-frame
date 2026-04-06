import { GetStations, GetStationsParams, GetStationsResponse } from "./types";
import { MOCK_STATIONS, safeSerialize } from "../../demo/database";

export const mockGetStations: GetStations = async (_params?: GetStationsParams): Promise<GetStationsResponse> => {
    console.log("[Mock] getStations called", _params);
    const stations = safeSerialize(MOCK_STATIONS);
    return {
        stations,
        timestamp: new Date().toISOString()
    };
};
