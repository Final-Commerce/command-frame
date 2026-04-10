import { MOCK_USER_MARIO } from "../../demo/database";
import { GetActiveUser, GetActiveUserResponse } from "./types";

export const mockGetActiveUser: GetActiveUser = async (): Promise<GetActiveUserResponse> => {
    console.log("[Mock] getActiveUser called");
    return {
        success: true,
        user: MOCK_USER_MARIO,
        timestamp: new Date().toISOString()
    };
};
