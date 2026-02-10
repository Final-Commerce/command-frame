/**
 * Get secret value action
 * Calls the getSecretVal action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GetSecretVal,
    GetSecretValParams,
    GetSecretValResponse
} from "./types";

export const getSecretVal: GetSecretVal = async (params: GetSecretValParams): Promise<GetSecretValResponse> => {
    return await commandFrameClient.call<GetSecretValParams, GetSecretValResponse>("getSecretVal", params);
};
