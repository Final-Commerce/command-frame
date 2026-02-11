import { CFActiveUser } from "../../CommonTypes";

// Get Users Types
export interface GetUsersParams {
    /** Optional array of outlet IDs to filter users by */
    outlets?: string[];
}

export interface GetUsersResponse {
    users: CFActiveUser[];
    success: boolean;
    timestamp: string;
}

export type GetUsers = (params?: GetUsersParams) => Promise<GetUsersResponse>;
