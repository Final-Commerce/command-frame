/**
 * Get final context action
 * Calls the getFinalContext action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GetFinalContext,
    GetFinalContextResponse
} from "./types";

export const getFinalContext: GetFinalContext = async (): Promise<GetFinalContextResponse | null> => {
    return await commandFrameClient.call<undefined, GetFinalContextResponse | null>("getFinalContext", undefined);
};

