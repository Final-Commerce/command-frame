// Remove Non-Revenue Item Types
export interface RemoveNonRevenueItemParams {
    /** The externalId of the non-revenue item to remove */
    externalId: string;
}

export interface RemoveNonRevenueItemResponse {
    success: boolean;
    externalId: string;
    timestamp: string;
}

export type RemoveNonRevenueItem = (params: RemoveNonRevenueItemParams) => Promise<RemoveNonRevenueItemResponse>;
