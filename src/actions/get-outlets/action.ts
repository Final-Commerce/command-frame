import { commandFrameClient } from "../../client";
import type { GetOutlets, GetOutletsParams, GetOutletsResponse } from "./types";

export const getOutlets: GetOutlets = async (params?: GetOutletsParams): Promise<GetOutletsResponse> => {
    return await commandFrameClient.call<GetOutletsParams, GetOutletsResponse>("getOutlets", params ?? {});
};
