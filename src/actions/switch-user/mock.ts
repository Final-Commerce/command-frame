import { SwitchUser, SwitchUserParams, SwitchUserResponse } from "./types";

export const mockSwitchUser: SwitchUser = async (params?: SwitchUserParams): Promise<SwitchUserResponse> => {
    console.log("[Mock] switchUser called", params);
    
    return {
        success: true,
        mode: params?.mode || 'dialog',
        roleIds: params?.roleIds,
        userId: params?.userId,
        timestamp: new Date().toISOString()
    };
};

