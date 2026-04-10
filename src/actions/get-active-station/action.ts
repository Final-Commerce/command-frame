import { commandFrameClient } from "../../client";
import type { GetActiveStation, GetActiveStationResponse } from "./types";

export const getActiveStation: GetActiveStation = async (): Promise<GetActiveStationResponse> => {
    return await commandFrameClient.call<GetActiveStationResponse>("getActiveStation");
};
