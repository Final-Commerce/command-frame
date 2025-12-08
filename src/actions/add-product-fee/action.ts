/**
 * Add product fee action
 * Calls the addProductFee action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    AddProductFee,
    AddProductFeeParams,
    AddProductFeeResponse
} from "./types";

export const addProductFee: AddProductFee = async (params?: AddProductFeeParams): Promise<AddProductFeeResponse> => {
    return await commandFrameClient.call<AddProductFeeParams, AddProductFeeResponse>("addProductFee", params);
};

