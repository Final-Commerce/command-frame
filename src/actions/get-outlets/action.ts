import { commandFrameClient } from "../../client";
import type { GetOutlets, GetOutletsResponse } from "./types";

export const getOutlets: GetOutlets = async (): Promise<GetOutletsResponse> => {
    return await commandFrameClient.call<undefined, GetOutletsResponse>("getOutlets");
};
