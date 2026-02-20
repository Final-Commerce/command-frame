import { GetStations, GetStationsParams, GetStationsResponse } from "./types";

export const mockGetStations: GetStations = async (params?: GetStationsParams): Promise<GetStationsResponse> => {
    console.log("[Mock] getStations called", params);
    return {
        stations: [
            {
                _id: "mock_station_001",
                name: "POS Terminal 1",
                status: "active",
                sequenceNumber: 1,
            },
            {
                _id: "mock_station_002",
                name: "POS Terminal 2",
                status: "active",
                sequenceNumber: 2,
            },
        ],
        timestamp: new Date().toISOString(),
    };
};
