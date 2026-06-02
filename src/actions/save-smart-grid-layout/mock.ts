import { MOCK_SMART_GRID_LAYOUTS } from "../../demo/database";
import { SaveSmartGridLayout, SaveSmartGridLayoutParams, SaveSmartGridLayoutResponse } from "./types";

export const mockSaveSmartGridLayout: SaveSmartGridLayout = (params: SaveSmartGridLayoutParams): Promise<SaveSmartGridLayoutResponse> => {
    console.log("[Mock] saveSmartGridLayout called", params);
    MOCK_SMART_GRID_LAYOUTS[params.layout.gridId] = params.layout;
    return Promise.resolve({
        success: true,
        gridId: params.layout.gridId,
        timestamp: new Date().toISOString()
    });
};
