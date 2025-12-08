/**
 * Set refund stock action
 * Calls the setRefundStockAction action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    SetRefundStockAction,
    SetRefundStockActionParams,
    SetRefundStockActionResponse
} from "./types";

export const setRefundStockAction: SetRefundStockAction = async (params?: SetRefundStockActionParams): Promise<SetRefundStockActionResponse> => {
    return await commandFrameClient.call<SetRefundStockActionParams, SetRefundStockActionResponse>("setRefundStockAction", params);
};

