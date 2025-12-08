/**
 * Switch user action
 * Calls the switchUser action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    SwitchUser,
    SwitchUserParams,
    SwitchUserResponse
} from "./types";

export const switchUser: SwitchUser = async (params?: SwitchUserParams): Promise<SwitchUserResponse> => {
    return await commandFrameClient.call<SwitchUserParams, SwitchUserResponse>("switchUser", params);
};

