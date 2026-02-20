import { commandFrameClient } from "../../client";
import type { EditProductVariants, EditProductVariantsParams, EditProductVariantsResponse } from "./types";

export const editProductVariants: EditProductVariants = async (params: EditProductVariantsParams): Promise<EditProductVariantsResponse> => {
    return await commandFrameClient.call<EditProductVariantsParams, EditProductVariantsResponse>("editProductVariants", params);
};
