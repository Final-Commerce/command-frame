// Remove Custom Sale Types
export interface RemoveCustomSaleParams {
    /** The id of the custom sale to remove */
    id: string;
}

export interface RemoveCustomSaleResponse {
    success: boolean;
    id: string;
    timestamp: string;
}

export type RemoveCustomSale = (params: RemoveCustomSaleParams) => Promise<RemoveCustomSaleResponse>;
