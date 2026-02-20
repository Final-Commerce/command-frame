import { commandFrameClient } from "../../client";
import type { AddProduct, AddProductParams, AddProductResponse } from "./types";

export const addProduct: AddProduct = async (params: AddProductParams): Promise<AddProductResponse> => {
    return await commandFrameClient.call<AddProductParams, AddProductResponse>("addProduct", params);
};
