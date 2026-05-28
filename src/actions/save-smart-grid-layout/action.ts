import { commandFrameClient } from "../../client";
import type { SaveSmartGridLayout, SaveSmartGridLayoutParams, SaveSmartGridLayoutResponse } from "./types";

export const saveSmartGridLayout: SaveSmartGridLayout = async (params: SaveSmartGridLayoutParams): Promise<SaveSmartGridLayoutResponse> => {
    return await commandFrameClient.call<SaveSmartGridLayoutParams, SaveSmartGridLayoutResponse>("saveSmartGridLayout", params);
};
