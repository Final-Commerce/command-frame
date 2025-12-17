// Add Product Note Types
export interface AddProductNoteParams {
    note: string;
    /** The unique identifier for a specific line item in the cart. If not provided, it may attempt to modify the active product context. */
    internalId?: string;
}

export interface AddProductNoteResponse {
    success: boolean;
    note: string;
    internalId?: string;
    timestamp: string;
}

export type AddProductNote = (params?: AddProductNoteParams) => Promise<AddProductNoteResponse>;
