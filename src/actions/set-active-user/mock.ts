import { MOCK_USERS } from "../../demo/database";
import { SetActiveUser, SetActiveUserParams, SetActiveUserResponse } from "./types";

export const mockSetActiveUser: SetActiveUser = async (
    params?: SetActiveUserParams
): Promise<SetActiveUserResponse> => {
    console.log("[Mock] setActiveUser called", params);
    if (!params?.userId) {
        throw new Error("userId is required");
    }
    const found = MOCK_USERS.find(u => u.id === params.userId);
    if (!found) {
        throw new Error(`User with ID ${params.userId} not found`);
    }
    return {
        success: true,
        user: found,
        timestamp: new Date().toISOString()
    };
};
