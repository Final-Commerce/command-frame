/**
 * Get final context action
 * Calls the getFinalContext action on the parent window
 * Uses a 5-second timeout since this should respond quickly
 */

import { commandFrameClient } from "../../client";
import type {
    GetFinalContext,
    GetFinalContextResponse
} from "./types";

const GET_FINAL_CONTEXT_TIMEOUT = 5000; // 5 seconds

export const getFinalContext: GetFinalContext = async (): Promise<GetFinalContextResponse | null> => {
    return await commandFrameClient.call<undefined, GetFinalContextResponse | null>("getFinalContext", undefined, GET_FINAL_CONTEXT_TIMEOUT);
};

