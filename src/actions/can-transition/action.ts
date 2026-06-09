import { commandFrameClient } from "../../client";
import type { CanTransition, CanTransitionParams, CanTransitionResponse } from "./types";

export const canTransition: CanTransition = async (
    params: CanTransitionParams
): Promise<CanTransitionResponse> => {
    return await commandFrameClient.call<CanTransitionParams, CanTransitionResponse>(
        "canTransition",
        params
    );
};
