import { MOCK_STATION_1 } from "../../demo/database";
import { GetActiveStation, GetActiveStationResponse } from "./types";

export const mockGetActiveStation: GetActiveStation = async (): Promise<GetActiveStationResponse> => {
    console.log("[Mock] getActiveStation called");
    return {
        success: true,
        station: MOCK_STATION_1,
        timestamp: new Date().toISOString()
    };
};
