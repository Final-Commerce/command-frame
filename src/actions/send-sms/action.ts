/**
 * Send SMS action — text the customer the active order's (or a refund's) receipt.
 * Calls the sendSms action on the parent window.
 */

import { commandFrameClient } from "../../client";
import type { SendSms, SendSmsParams, SendSmsResponse } from "./types";

export const sendSms: SendSms = async (params?: SendSmsParams): Promise<SendSmsResponse> => {
    return await commandFrameClient.call<SendSmsParams, SendSmsResponse>("sendSms", params);
};
