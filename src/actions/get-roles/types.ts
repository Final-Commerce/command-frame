import { CFActiveUserRole } from "../../CommonTypes";

// Get Roles Types
export interface GetRolesParams {
    // No params needed - roles are fetched for the current company
}

export interface GetRolesResponse {
    roles: CFActiveUserRole[];
    success: boolean;
    timestamp: string;
}

export type GetRoles = (params?: GetRolesParams) => Promise<GetRolesResponse>;
