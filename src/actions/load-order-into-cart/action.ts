/**
 * Load order into cart action
 * Puts a saved, till-eligible order on the till: optionally moves its fulfillment state first,
 * then hydrates the full cart context (lines, custom sales, fees, discounts, notes, split/partial
 * payments + remaining balance, customer, signature) and pins the active order.
 *
 * This is the rails replacement for resumeParkedOrder's hydration half — state moves belong to
 * applyTransition (or the optional targetFulfillmentState here, which is the same engine call).
 */

import { commandFrameClient } from "../../client";
import type {
    LoadOrderIntoCart,
    LoadOrderIntoCartParams,
    LoadOrderIntoCartResponse
} from "./types";

export const loadOrderIntoCart: LoadOrderIntoCart = async (params: LoadOrderIntoCartParams): Promise<LoadOrderIntoCartResponse> => {
    return await commandFrameClient.call<LoadOrderIntoCartParams, LoadOrderIntoCartResponse>("loadOrderIntoCart", params);
};
