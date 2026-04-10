import { commandFrameClient } from "../../client";
import type { SetActiveSession, SetActiveSessionParams, SetActiveSessionResponse } from "./types";

export const setActiveSession: SetActiveSession = async (
    params?: SetActiveSessionParams
): Promise<SetActiveSessionResponse> => {
    return await commandFrameClient.call<SetActiveSessionParams, SetActiveSessionResponse>("setActiveSession", params);
};
