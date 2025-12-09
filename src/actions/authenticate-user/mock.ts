import { AuthenticateUser, AuthenticateUserParams, AuthenticateUserResponse } from "./types";

export const mockAuthenticateUser: AuthenticateUser = async (params?: AuthenticateUserParams): Promise<AuthenticateUserResponse> => {
    console.log("[Mock] authenticateUser called", params);
    
    return {
        success: true,
        roleIds: params?.roleIds || [],
        timestamp: new Date().toISOString()
    };
};

