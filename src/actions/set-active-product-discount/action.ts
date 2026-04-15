/**
 * Set active product discount action
 * Updates the discount on the currently active product (without adding to cart)
 */

import { commandFrameClient } from "../../client";
import type {
    SetActiveProductDiscount,
    SetActiveProductDiscountParams,
    SetActiveProductDiscountResponse
} from "./types";

export const setActiveProductDiscount: SetActiveProductDiscount = async (params: SetActiveProductDiscountParams): Promise<SetActiveProductDiscountResponse> => {
    return await commandFrameClient.call<SetActiveProductDiscountParams, SetActiveProductDiscountResponse>("setActiveProductDiscount", params);
};
