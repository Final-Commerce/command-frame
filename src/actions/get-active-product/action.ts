/**
 * Get active product action
 * Calls the getActiveProduct action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GetActiveProduct,
    GetActiveProductResponse
} from "./types";

export const getActiveProduct: GetActiveProduct = async (): Promise<GetActiveProductResponse> => {
    return await commandFrameClient.call<GetActiveProductResponse>("getActiveProduct");
};
