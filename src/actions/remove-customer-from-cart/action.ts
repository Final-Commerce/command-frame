/**
 * Remove customer from cart action
 * Calls the removeCustomerFromCart action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    RemoveCustomerFromCart,
    RemoveCustomerFromCartResponse
} from "./types";

export const removeCustomerFromCart: RemoveCustomerFromCart = async (): Promise<RemoveCustomerFromCartResponse> => {
    return await commandFrameClient.call<undefined, RemoveCustomerFromCartResponse>("removeCustomerFromCart", undefined);
};

