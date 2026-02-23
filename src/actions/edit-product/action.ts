import { commandFrameClient } from "../../client";
import type { EditProduct, EditProductParams, EditProductResponse } from "./types";

export const editProduct: EditProduct = async (params: EditProductParams): Promise<EditProductResponse> => {
    return await commandFrameClient.call<EditProductParams, EditProductResponse>("editProduct", params);
};
