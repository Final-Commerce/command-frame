/**
 * Set active order action
 * Calls the setActiveOrder action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    SetActiveOrder,
    SetActiveOrderParams,
    SetActiveOrderResponse
} from "./types";

export const setActiveOrder: SetActiveOrder = async (params?: SetActiveOrderParams): Promise<SetActiveOrderResponse> => {
    return await commandFrameClient.call<SetActiveOrderParams, SetActiveOrderResponse>("setActiveOrder", params);
};
