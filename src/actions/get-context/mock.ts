import { GetContext, GetContextResponse } from "./types";
import { MOCK_COMPANY, MOCK_OUTLET, MOCK_STATION, MOCK_USER } from "../../demo/database";

export const mockGetContext: GetContext = async (): Promise<GetContextResponse> => {
    console.log("[Mock] getContext called");
    
    return {
        userId: MOCK_USER.id,
        companyId: MOCK_COMPANY.id || null,
        companyName: MOCK_COMPANY.name || null,
        deviceId: "mock_device_id",
        stationId: MOCK_STATION._id,
        stationName: MOCK_STATION.name,
        outletId: MOCK_OUTLET.id,
        outletName: MOCK_OUTLET.name || null,
        buildId: "mock_build_id",
        buildName: "Mock Build",
        buildVersion: "1.0.0-mock",
        buildSourceId: "mock_source_id",
        buildIsPremium: true,
        user: null,
        company: null,
        station: null,
        outlet: null,
        timestamp: new Date().toISOString()
    };
};

