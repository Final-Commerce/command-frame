// Authenticate User Types
export interface AuthenticateUserParams {
    roleIds: string[];
}

export interface AuthenticateUserResponse {
    success: boolean;
    roleIds: string[];
    timestamp: string;
}

export type AuthenticateUser = (params?: AuthenticateUserParams) => Promise<AuthenticateUserResponse>;

