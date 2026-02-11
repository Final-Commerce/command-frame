/**
 * Get users action
 * Calls the getUsers action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GetUsers,
    GetUsersParams,
    GetUsersResponse
} from "./types";

export const getUsers: GetUsers = async (params?: GetUsersParams): Promise<GetUsersResponse> => {
    return await commandFrameClient.call<GetUsersParams, GetUsersResponse>("getUsers", params);
};
