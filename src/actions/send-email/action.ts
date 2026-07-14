/**
 * Send email action — email the customer the active order's (or a refund's) receipt.
 * Calls the sendEmail action on the parent window.
 */

import { commandFrameClient } from "../../client";
import type { SendEmail, SendEmailParams, SendEmailResponse } from "./types";

export const sendEmail: SendEmail = async (params?: SendEmailParams): Promise<SendEmailResponse> => {
    return await commandFrameClient.call<SendEmailParams, SendEmailResponse>("sendEmail", params);
};
