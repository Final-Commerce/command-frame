/**
 * Set active product fee action
 * Updates the fee on the currently active product (without adding to cart)
 */

import { commandFrameClient } from "../../client";
import type {
    SetActiveProductFee,
    SetActiveProductFeeParams,
    SetActiveProductFeeResponse
} from "./types";

export const setActiveProductFee: SetActiveProductFee = async (params: SetActiveProductFeeParams): Promise<SetActiveProductFeeResponse> => {
    return await commandFrameClient.call<SetActiveProductFeeParams, SetActiveProductFeeResponse>("setActiveProductFee", params);
};
