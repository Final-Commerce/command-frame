/**
 * Set secret value action
 * Calls the setSecretVal action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    SetSecretVal,
    SetSecretValParams,
    SetSecretValResponse
} from "./types";

export const setSecretVal: SetSecretVal = async (params: SetSecretValParams): Promise<SetSecretValResponse> => {
    return await commandFrameClient.call<SetSecretValParams, SetSecretValResponse>("setSecretVal", params);
};
