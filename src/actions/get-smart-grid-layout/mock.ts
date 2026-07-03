import { MOCK_SMART_GRID_LAYOUTS } from "../../demo/database";
import { GetSmartGridLayout, GetSmartGridLayoutParams, GetSmartGridLayoutResponse } from "./types";

export const mockGetSmartGridLayout: GetSmartGridLayout = (params: GetSmartGridLayoutParams): Promise<GetSmartGridLayoutResponse> => {
    console.log("[Mock] getSmartGridLayout called", params);
    return Promise.resolve({
        success: true,
        layout: MOCK_SMART_GRID_LAYOUTS[params.gridId] ?? null,
        timestamp: new Date().toISOString()
    });
};
