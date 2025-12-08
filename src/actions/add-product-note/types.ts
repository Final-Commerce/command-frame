// Add Product Note Types
export interface AddProductNoteParams {
    note: string;
}

export interface AddProductNoteResponse {
    success: boolean;
    note: string;
    timestamp: string;
}

export type AddProductNote = (params?: AddProductNoteParams) => Promise<AddProductNoteResponse>;

