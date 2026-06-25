import type { SaveSmartGridLayout, SaveSmartGridLayoutParams, SaveSmartGridLayoutResponse } from "./types";

export const mockSaveSmartGridLayout: SaveSmartGridLayout = (params: SaveSmartGridLayoutParams): Promise<SaveSmartGridLayoutResponse> => {
    return Promise.resolve({
        success: true,
        gridId: params.layout.gridId,
        timestamp: new Date().toISOString()
    });
};
