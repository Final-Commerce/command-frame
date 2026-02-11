/**
 * Get roles action
 * Calls the getRoles action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GetRoles,
    GetRolesParams,
    GetRolesResponse
} from "./types";

export const getRoles: GetRoles = async (params?: GetRolesParams): Promise<GetRolesResponse> => {
    return await commandFrameClient.call<GetRolesParams, GetRolesResponse>("getRoles", params);
};
