import { commandFrameClient } from "../../client";
import type { RemoveProductDiscount, RemoveProductDiscountParams, RemoveProductDiscountResponse } from "./types";

export const removeProductDiscount: RemoveProductDiscount = async (
    params?: RemoveProductDiscountParams
): Promise<RemoveProductDiscountResponse> => {
    return await commandFrameClient.call<RemoveProductDiscountParams | undefined, RemoveProductDiscountResponse>("removeProductDiscount", params);
};
