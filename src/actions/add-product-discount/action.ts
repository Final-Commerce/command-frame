/**
 * Add product discount action
 * Calls the addProductDiscount action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    AddProductDiscount,
    AddProductDiscountParams,
    AddProductDiscountResponse
} from "./types";

export const addProductDiscount: AddProductDiscount = async (params?: AddProductDiscountParams): Promise<AddProductDiscountResponse> => {
    return await commandFrameClient.call<AddProductDiscountParams, AddProductDiscountResponse>("addProductDiscount", params);
};

