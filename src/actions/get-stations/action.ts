import { commandFrameClient } from "../../client";
import type { GetStations, GetStationsParams, GetStationsResponse } from "./types";

export const getStations: GetStations = async (params?: GetStationsParams): Promise<GetStationsResponse> => {
    return await commandFrameClient.call<GetStationsParams, GetStationsResponse>("getStations", params);
};
