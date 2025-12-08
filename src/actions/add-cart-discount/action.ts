/**
 * Add cart discount action
 * Calls the addCartDiscount action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    AddCartDiscount,
    AddCartDiscountParams,
    AddCartDiscountResponse
} from "./types";

export const addCartDiscount: AddCartDiscount = async (params?: AddCartDiscountParams): Promise<AddCartDiscountResponse> => {
    return await commandFrameClient.call<AddCartDiscountParams, AddCartDiscountResponse>("addCartDiscount", params);
};
