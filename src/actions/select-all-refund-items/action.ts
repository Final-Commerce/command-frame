/**
 * Select all refund items action
 * Calls the selectAllRefundItems action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    SelectAllRefundItems,
    SelectAllRefundItemsResponse
} from "./types";

export const selectAllRefundItems: SelectAllRefundItems = async (): Promise<SelectAllRefundItemsResponse> => {
    return await commandFrameClient.call<undefined, SelectAllRefundItemsResponse>("selectAllRefundItems");
};

