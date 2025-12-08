/**
 * Resume parked order action
 * Calls the resumeParkedOrder action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    ResumeParkedOrder,
    ResumeParkedOrderParams,
    ResumeParkedOrderResponse
} from "./types";

export const resumeParkedOrder: ResumeParkedOrder = async (params?: ResumeParkedOrderParams): Promise<ResumeParkedOrderResponse> => {
    return await commandFrameClient.call<ResumeParkedOrderParams, ResumeParkedOrderResponse>("resumeParkedOrder", params);
};

