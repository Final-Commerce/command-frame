/**
 * Add cart fee action
 * Calls the addCartFee action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    AddCartFee,
    AddCartFeeParams,
    AddCartFeeResponse
} from "./types";

export const addCartFee: AddCartFee = async (params?: AddCartFeeParams): Promise<AddCartFeeResponse> => {
    return await commandFrameClient.call<AddCartFeeParams, AddCartFeeResponse>("addCartFee", params);
};

