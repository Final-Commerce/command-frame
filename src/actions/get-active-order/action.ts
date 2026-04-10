/**
 * Get active order action
 * Calls the getActiveOrder action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GetActiveOrder,
    GetActiveOrderResponse
} from "./types";

export const getActiveOrder: GetActiveOrder = async (): Promise<GetActiveOrderResponse> => {
    return await commandFrameClient.call<GetActiveOrderResponse>("getActiveOrder");
};
