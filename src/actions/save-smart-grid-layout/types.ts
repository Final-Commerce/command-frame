import { CFSmartGridLayout } from "../../CommonTypes";

export interface SaveSmartGridLayoutParams {
    layout: CFSmartGridLayout;
}

export interface SaveSmartGridLayoutResponse {
    success: boolean;
    gridId: string;
    timestamp: string;
}

export type SaveSmartGridLayout = (params: SaveSmartGridLayoutParams) => Promise<SaveSmartGridLayoutResponse>;
