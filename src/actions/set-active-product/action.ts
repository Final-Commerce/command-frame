/**
 * Set active product action
 * Calls the setActiveProduct action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    SetActiveProduct,
    SetActiveProductParams,
    SetActiveProductResponse
} from "./types";

export const setActiveProduct: SetActiveProduct = async (params?: SetActiveProductParams): Promise<SetActiveProductResponse> => {
    return await commandFrameClient.call<SetActiveProductParams, SetActiveProductResponse>("setActiveProduct", params);
};
