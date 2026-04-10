import { MOCK_SESSION } from "../../demo/database";
import { GetActiveSession, GetActiveSessionResponse } from "./types";

export const mockGetActiveSession: GetActiveSession = async (): Promise<GetActiveSessionResponse> => {
    console.log("[Mock] getActiveSession called");
    return {
        success: true,
        session: MOCK_SESSION,
        timestamp: new Date().toISOString()
    };
};
