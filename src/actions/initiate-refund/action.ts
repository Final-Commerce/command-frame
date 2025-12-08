/**
 * Initiate refund action
 * Calls the initiateRefund action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    InitiateRefund,
    InitiateRefundParams,
    InitiateRefundResponse
} from "./types";

export const initiateRefund: InitiateRefund = async (params?: InitiateRefundParams): Promise<InitiateRefundResponse> => {
    return await commandFrameClient.call<InitiateRefundParams, InitiateRefundResponse>("initiateRefund", params);
};

