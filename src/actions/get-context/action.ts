/**
 * Get context action
 * Calls the getContext action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GetContext,
    GetContextResponse
} from "./types";

export const getContext: GetContext = async (): Promise<GetContextResponse> => {
    return await commandFrameClient.call<undefined, GetContextResponse>("getContext", undefined);
};

