// Remove Product Note Types
export interface RemoveProductNoteParams {
    /** If provided, removes note from specific cart item. Otherwise uses active product. */
    internalId?: string;
}

export interface RemoveProductNoteResponse {
    success: boolean;
    internalId?: string;
    timestamp: string;
}

export type RemoveProductNote = (params?: RemoveProductNoteParams) => Promise<RemoveProductNoteResponse>;
