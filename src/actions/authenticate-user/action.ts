/**
 * Authenticate user action
 * Calls the authenticateUser action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    AuthenticateUser,
    AuthenticateUserParams,
    AuthenticateUserResponse
} from "./types";

export const authenticateUser: AuthenticateUser = async (params?: AuthenticateUserParams): Promise<AuthenticateUserResponse> => {
    return await commandFrameClient.call<AuthenticateUserParams, AuthenticateUserResponse>("authenticateUser", params);
};

