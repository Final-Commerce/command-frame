import { MOCK_USER_MARIO, mockPublishEvent } from "../../demo/database";
import { GetActiveUser, GetActiveUserResponse } from "./types";

export const mockGetActiveUser: GetActiveUser = async (): Promise<GetActiveUserResponse> => {
    console.log("[Mock] getActiveUser called");
    // Same as the host (kaching get-active-user handler): reading the user publishes `users` / `get-active-user`.
    mockPublishEvent("users", "get-active-user", { user: MOCK_USER_MARIO });
    return {
        success: true,
        user: MOCK_USER_MARIO,
        timestamp: new Date().toISOString()
    };
};
