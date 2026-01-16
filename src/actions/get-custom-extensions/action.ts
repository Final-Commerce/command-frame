/**
 * Get custom extensions action
 * Calls the getCustomExtensions action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GetCustomExtensions,
    GetCustomExtensionsResponse
} from "./types";

export const getCustomExtensions: GetCustomExtensions = async (): Promise<GetCustomExtensionsResponse> => {
    return await commandFrameClient.call<undefined, GetCustomExtensionsResponse>("getCustomExtensions");
};
