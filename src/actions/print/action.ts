/**
 * Print action
 * Calls the print action on the parent window
 */

import { commandFrameClient } from "../../client";
import type { Print, PrintParams, PrintResponse } from "./types";

export const print: Print = async (params?: PrintParams): Promise<PrintResponse> => {
    return await commandFrameClient.call<PrintParams, PrintResponse>("print", params);
};
