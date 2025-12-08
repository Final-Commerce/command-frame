/**
 * Get remaining refundable quantities action
 * Calls the getRemainingRefundableQuantities action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GetRemainingRefundableQuantities,
    GetRemainingRefundableQuantitiesResponse
} from "./types";

export const getRemainingRefundableQuantities: GetRemainingRefundableQuantities = async (): Promise<GetRemainingRefundableQuantitiesResponse> => {
    return await commandFrameClient.call<undefined, GetRemainingRefundableQuantitiesResponse>("getRemainingRefundableQuantities");
};

