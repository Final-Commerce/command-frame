import type { CFSmartGridLayout } from "../../CommonTypes";

/** Fetch a builder SmartGrid layout by `gridId`. */
export interface GetSmartGridLayoutParams {
    gridId: string;
}

export interface GetSmartGridLayoutResponse {
    success: boolean;
    /** The stored layout, or `null` when no layout exists for the grid. */
    layout: CFSmartGridLayout | null;
    timestamp: string;
}

export type GetSmartGridLayout = (params: GetSmartGridLayoutParams) => Promise<GetSmartGridLayoutResponse>;
