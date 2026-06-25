import type { CFSmartGridLayout } from "../../CommonTypes";

/** Persist a builder SmartGrid layout. The `layout.gridId` identifies the grid. */
export interface SaveSmartGridLayoutParams {
    layout: CFSmartGridLayout;
}

export interface SaveSmartGridLayoutResponse {
    success: boolean;
    /** The gridId that was saved. */
    gridId: string;
    timestamp: string;
}

export type SaveSmartGridLayout = (params: SaveSmartGridLayoutParams) => Promise<SaveSmartGridLayoutResponse>;
