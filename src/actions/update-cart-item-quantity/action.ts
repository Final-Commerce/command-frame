/**
 * Update cart item quantity action
 * Calls the updateCartItemQuantity action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    UpdateCartItemQuantity,
    UpdateCartItemQuantityParams,
    UpdateCartItemQuantityResponse
} from "./types";

export const updateCartItemQuantity: UpdateCartItemQuantity = async (params?: UpdateCartItemQuantityParams): Promise<UpdateCartItemQuantityResponse> => {
    return await commandFrameClient.call<UpdateCartItemQuantityParams, UpdateCartItemQuantityResponse>("updateCartItemQuantity", params);
};

