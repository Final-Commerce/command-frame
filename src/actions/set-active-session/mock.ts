import { MOCK_SESSION } from "../../demo/database";
import { SetActiveSession, SetActiveSessionParams, SetActiveSessionResponse } from "./types";

export const mockSetActiveSession: SetActiveSession = async (
    params?: SetActiveSessionParams
): Promise<SetActiveSessionResponse> => {
    console.log("[Mock] setActiveSession called", params);
    if (!params?.sessionId) {
        throw new Error("sessionId is required");
    }
    if (params.sessionId !== MOCK_SESSION.id) {
        throw new Error(`Session with ID ${params.sessionId} not found`);
    }
    return {
        success: true,
        session: MOCK_SESSION,
        timestamp: new Date().toISOString()
    };
};
