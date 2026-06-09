import { CFSmartGridLayout } from "../../CommonTypes";

export interface GetSmartGridLayoutParams {
    gridId: string;
}

export interface GetSmartGridLayoutResponse {
    success: boolean;
    layout: CFSmartGridLayout | null;
    timestamp: string;
}

export type GetSmartGridLayout = (params: GetSmartGridLayoutParams) => Promise<GetSmartGridLayoutResponse>;
