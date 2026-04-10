import { commandFrameClient } from "../../client";
import type { GetActiveSession, GetActiveSessionResponse } from "./types";

export const getActiveSession: GetActiveSession = async (): Promise<GetActiveSessionResponse> => {
    return await commandFrameClient.call<GetActiveSessionResponse>("getActiveSession");
};
