/**
 * Remove product from cart action
 * Calls the removeProductFromCart action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    RemoveProductFromCart,
    RemoveProductFromCartParams,
    RemoveProductFromCartResponse
} from "./types";

export const removeProductFromCart: RemoveProductFromCart = async (params?: RemoveProductFromCartParams): Promise<RemoveProductFromCartResponse> => {
    return await commandFrameClient.call<RemoveProductFromCartParams, RemoveProductFromCartResponse>("removeProductFromCart", params);
};
