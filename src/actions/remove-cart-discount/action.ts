/**
 * Remove cart discount action
 * Calls the removeCartDiscount action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    RemoveCartDiscount,
    RemoveCartDiscountResponse
} from "./types";

export const removeCartDiscount: RemoveCartDiscount = async (): Promise<RemoveCartDiscountResponse> => {
    return await commandFrameClient.call<RemoveCartDiscountResponse>("removeCartDiscount");
};