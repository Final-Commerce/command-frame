import { EditProductVariants, EditProductVariantsParams, EditProductVariantsResponse } from "./types";

export const mockEditProductVariants: EditProductVariants = async (params: EditProductVariantsParams): Promise<EditProductVariantsResponse> => {
    console.log("[Mock] editProductVariants called", params);
    return {
        success: true,
        timestamp: new Date().toISOString(),
    };
};
