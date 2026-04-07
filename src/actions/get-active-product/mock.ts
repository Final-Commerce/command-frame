import { GetActiveProduct, GetActiveProductResponse } from "./types";
import { MOCK_ACTIVE_PRODUCT } from "../../demo/database";

export const mockGetActiveProduct: GetActiveProduct = async (): Promise<GetActiveProductResponse> => {
    console.log("[Mock] getActiveProduct called");

    return {
        success: true,
        product: MOCK_ACTIVE_PRODUCT? {...MOCK_ACTIVE_PRODUCT} : null,
        timestamp: new Date().toISOString()
    };
};
