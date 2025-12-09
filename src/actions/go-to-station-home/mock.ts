import { GoToStationHome, GoToStationHomeResponse } from "./types";

export const mockGoToStationHome: GoToStationHome = async (): Promise<GoToStationHomeResponse> => {
    console.log("[Mock] goToStationHome called");
    
    return {
        success: true,
        timestamp: new Date().toISOString()
    };
};

