/**
 * Add product to cart action
 * Calls the addProductToCart action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    AddProductToCart,
    AddProductToCartParams,
    AddProductToCartResponse
} from "./types";

export const addProductToCart: AddProductToCart = async (params?: AddProductToCartParams): Promise<AddProductToCartResponse> => {
    return await commandFrameClient.call<AddProductToCartParams, AddProductToCartResponse>("addProductToCart", params);
};

