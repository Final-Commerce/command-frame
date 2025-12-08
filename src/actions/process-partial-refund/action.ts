/**
 * Process partial refund action
 * Calls the processPartialRefund action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    ProcessPartialRefund,
    ProcessPartialRefundParams,
    ProcessPartialRefundResponse
} from "./types";

export const processPartialRefund: ProcessPartialRefund = async (params?: ProcessPartialRefundParams): Promise<ProcessPartialRefundResponse> => {
    return await commandFrameClient.call<ProcessPartialRefundParams, ProcessPartialRefundResponse>("processPartialRefund", params);
};

