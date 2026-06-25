import { commandFrameClient } from "../../client";
import type { GetSmartGridLayout, GetSmartGridLayoutParams, GetSmartGridLayoutResponse } from "./types";

export const getSmartGridLayout: GetSmartGridLayout = async (params: GetSmartGridLayoutParams): Promise<GetSmartGridLayoutResponse> => {
    return await commandFrameClient.call<GetSmartGridLayoutParams, GetSmartGridLayoutResponse>("getSmartGridLayout", params);
};
