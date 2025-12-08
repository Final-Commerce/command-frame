/**
 * Reset refund details action
 * Calls the resetRefundDetails action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    ResetRefundDetails,
    ResetRefundDetailsResponse
} from "./types";

export const resetRefundDetails: ResetRefundDetails = async (): Promise<ResetRefundDetailsResponse> => {
    return await commandFrameClient.call<undefined, ResetRefundDetailsResponse>("resetRefundDetails");
};

