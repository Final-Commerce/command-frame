import { commandFrameClient } from "../../client";
import type { RemoveCartFee, RemoveCartFeeParams, RemoveCartFeeResponse } from "./types";

export const removeCartFee: RemoveCartFee = async (params: RemoveCartFeeParams): Promise<RemoveCartFeeResponse> => {
    return await commandFrameClient.call<RemoveCartFeeParams, RemoveCartFeeResponse>("removeCartFee", params);
};
