import { commandFrameClient } from "../../client";
import type { ApplyTransition, ApplyTransitionParams, ApplyTransitionResponse } from "./types";

export const applyTransition: ApplyTransition = async (params: ApplyTransitionParams): Promise<ApplyTransitionResponse> => {
    return await commandFrameClient.call<ApplyTransitionParams, ApplyTransitionResponse>("applyTransition", params);
};
