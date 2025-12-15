// Add Product Note Types
export interface AddProductNoteParams {
    note: string;
    cartItemId?: string;
}

export interface AddProductNoteResponse {
    success: boolean;
    note: string;
    cartItemId?: string;
    timestamp: string;
}

export type AddProductNote = (params?: AddProductNoteParams) => Promise<AddProductNoteResponse>;
