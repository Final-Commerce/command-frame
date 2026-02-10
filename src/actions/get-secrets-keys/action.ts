/**
 * Get secrets keys action
 * Calls the getSecretsKeys action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GetSecretsKeys,
    GetSecretsKeysParams,
    GetSecretsKeysResponse
} from "./types";

export const getSecretsKeys: GetSecretsKeys = async (params?: GetSecretsKeysParams): Promise<GetSecretsKeysResponse> => {
    return await commandFrameClient.call<GetSecretsKeysParams | undefined, GetSecretsKeysResponse>("getSecretsKeys", params);
};
