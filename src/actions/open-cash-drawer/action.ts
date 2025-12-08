/**
 * Open cash drawer action
 * Calls the openCashDrawer action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    OpenCashDrawer,
    OpenCashDrawerResponse
} from "./types";

export const openCashDrawer: OpenCashDrawer = async (): Promise<OpenCashDrawerResponse> => {
    return await commandFrameClient.call<undefined, OpenCashDrawerResponse>("openCashDrawer", undefined);
};

