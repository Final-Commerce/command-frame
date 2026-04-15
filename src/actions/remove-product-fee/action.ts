import { commandFrameClient } from "../../client";
import type { RemoveProductFee, RemoveProductFeeParams, RemoveProductFeeResponse } from "./types";

export const removeProductFee: RemoveProductFee = async (
    params?: RemoveProductFeeParams
): Promise<RemoveProductFeeResponse> => {
    return await commandFrameClient.call<RemoveProductFeeParams | undefined, RemoveProductFeeResponse>("removeProductFee", params);
};
