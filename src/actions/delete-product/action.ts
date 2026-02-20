import { commandFrameClient } from "../../client";
import type { DeleteProduct, DeleteProductParams, DeleteProductResponse } from "./types";

export const deleteProduct: DeleteProduct = async (params: DeleteProductParams): Promise<DeleteProductResponse> => {
    return await commandFrameClient.call<DeleteProductParams, DeleteProductResponse>("deleteProduct", params);
};
