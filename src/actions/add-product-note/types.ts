// Add Product Note Types
export interface AddProductNoteParams {
    note: string;
    /** The internalId of the cart item to modify. If not provided, it may attempt to modify the active product context. */
    cartItemId?: string;
}

export interface AddProductNoteResponse {
    success: boolean;
    note: string;
    cartItemId?: string;
    timestamp: string;
}

export type AddProductNote = (params?: AddProductNoteParams) => Promise<AddProductNoteResponse>;
