import { commandFrameClient } from "../../client";
import type { SetActiveOutlet, SetActiveOutletParams, SetActiveOutletResponse } from "./types";

export const setActiveOutlet: SetActiveOutlet = async (
    params?: SetActiveOutletParams
): Promise<SetActiveOutletResponse> => {
    return await commandFrameClient.call<SetActiveOutletParams, SetActiveOutletResponse>("setActiveOutlet", params);
};
