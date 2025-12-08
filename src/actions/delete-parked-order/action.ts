/**
 * Delete parked order action
 * Calls the deleteParkedOrder action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    DeleteParkedOrder,
    DeleteParkedOrderParams,
    DeleteParkedOrderResponse
} from "./types";

export const deleteParkedOrder: DeleteParkedOrder = async (params?: DeleteParkedOrderParams): Promise<DeleteParkedOrderResponse> => {
    return await commandFrameClient.call<DeleteParkedOrderParams, DeleteParkedOrderResponse>("deleteParkedOrder", params);
};

