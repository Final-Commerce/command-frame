import { commandFrameClient } from "../../client";
import type { GetActiveRefund, GetActiveRefundResponse } from "./types";

export const getActiveRefund: GetActiveRefund = async (): Promise<GetActiveRefundResponse> => {
    return await commandFrameClient.call<GetActiveRefundResponse>("getActiveRefund");
};
