/**
 * Clear cart action
 * Calls the clearCart action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    ClearCart,
    ClearCartResponse
} from "./types";

export const clearCart: ClearCart = async (): Promise<ClearCartResponse> => {
    return await commandFrameClient.call<undefined, ClearCartResponse>("clearCart", undefined);
};

