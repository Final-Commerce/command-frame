/**
 * Get line items by order action
 * Calls the getLineItemsByOrder action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GetLineItemsByOrder,
    GetLineItemsByOrderParams,
    GetLineItemsByOrderResponse
} from "./types";

export const getLineItemsByOrder: GetLineItemsByOrder = async (params?: GetLineItemsByOrderParams): Promise<GetLineItemsByOrderResponse> => {
    return await commandFrameClient.call<GetLineItemsByOrderParams, GetLineItemsByOrderResponse>("getLineItemsByOrder", params);
};

