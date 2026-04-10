import { commandFrameClient } from "../../client";
import type { SetActiveStation, SetActiveStationParams, SetActiveStationResponse } from "./types";

export const setActiveStation: SetActiveStation = async (
    params?: SetActiveStationParams
): Promise<SetActiveStationResponse> => {
    return await commandFrameClient.call<SetActiveStationParams, SetActiveStationResponse>("setActiveStation", params);
};
