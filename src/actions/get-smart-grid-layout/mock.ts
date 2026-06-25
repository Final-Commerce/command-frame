import type { GetSmartGridLayout, GetSmartGridLayoutParams, GetSmartGridLayoutResponse } from "./types";

export const mockGetSmartGridLayout: GetSmartGridLayout = (params: GetSmartGridLayoutParams): Promise<GetSmartGridLayoutResponse> => {
    return Promise.resolve({
        success: true,
        layout: { gridId: params.gridId, cells: [] },
        timestamp: new Date().toISOString()
    });
};
