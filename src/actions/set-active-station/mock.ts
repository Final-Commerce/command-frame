import { MOCK_STATIONS } from "../../demo/database";
import { SetActiveStation, SetActiveStationParams, SetActiveStationResponse } from "./types";

export const mockSetActiveStation: SetActiveStation = async (
    params?: SetActiveStationParams
): Promise<SetActiveStationResponse> => {
    console.log("[Mock] setActiveStation called", params);
    if (!params?.stationId) {
        throw new Error("stationId is required");
    }
    const found = MOCK_STATIONS.find(s => s._id === params.stationId);
    if (!found) {
        throw new Error(`Station with ID ${params.stationId} not found`);
    }
    return {
        success: true,
        station: found,
        timestamp: new Date().toISOString()
    };
};
