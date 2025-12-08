// Set Product Active Types
export interface SetProductActiveParams {
    variantId: string;
}

export interface SetProductActiveResponse {
    success: boolean;
    variantId: string;
    timestamp: string;
}

export type SetProductActive = (params?: SetProductActiveParams) => Promise<SetProductActiveResponse>;

