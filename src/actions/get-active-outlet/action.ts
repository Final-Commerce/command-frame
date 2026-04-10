import { commandFrameClient } from "../../client";
import type { GetActiveOutlet, GetActiveOutletResponse } from "./types";

export const getActiveOutlet: GetActiveOutlet = async (): Promise<GetActiveOutletResponse> => {
    return await commandFrameClient.call<GetActiveOutletResponse>("getActiveOutlet");
};
