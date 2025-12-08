/**
 * Park order action
 * Calls the parkOrder action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    ParkOrder,
    ParkOrderResponse
} from "./types";

export const parkOrder: ParkOrder = async (): Promise<ParkOrderResponse> => {
    return await commandFrameClient.call<undefined, ParkOrderResponse>("parkOrder", undefined);
};

