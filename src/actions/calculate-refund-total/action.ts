/**
 * Calculate refund total action
 * Calls the calculateRefundTotal action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    CalculateRefundTotal,
    CalculateRefundTotalParams,
    CalculateRefundTotalResponse
} from "./types";

export const calculateRefundTotal: CalculateRefundTotal = async (
    params?: CalculateRefundTotalParams
): Promise<CalculateRefundTotalResponse> => {
    return await commandFrameClient.call<CalculateRefundTotalParams | undefined, CalculateRefundTotalResponse>("calculateRefundTotal", params);
};

