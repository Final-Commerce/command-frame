/**
 * Calculate refund total action
 * Calls the calculateRefundTotal action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    CalculateRefundTotal,
    CalculateRefundTotalResponse
} from "./types";

export const calculateRefundTotal: CalculateRefundTotal = async (): Promise<CalculateRefundTotalResponse> => {
    return await commandFrameClient.call<undefined, CalculateRefundTotalResponse>("calculateRefundTotal");
};

