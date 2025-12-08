/**
 * Terminal payment action
 * Calls the terminalPayment action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    TerminalPayment,
    TerminalPaymentParams,
    TerminalPaymentResponse
} from "./types";

export const terminalPayment: TerminalPayment = async (params?: TerminalPaymentParams): Promise<TerminalPaymentResponse> => {
    return await commandFrameClient.call<TerminalPaymentParams, TerminalPaymentResponse>("terminalPayment", params);
};

