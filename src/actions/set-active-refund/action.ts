import { commandFrameClient } from "../../client";
import type { SetActiveRefund, SetActiveRefundParams, SetActiveRefundResponse } from "./types";

export const setActiveRefund: SetActiveRefund = async (
    params?: SetActiveRefundParams
): Promise<SetActiveRefundResponse> => {
    return await commandFrameClient.call<SetActiveRefundParams, SetActiveRefundResponse>("setActiveRefund", params);
};
