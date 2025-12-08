// Add Order Note Types
export interface AddOrderNoteParams {
    note: string;
}

export interface AddOrderNoteResponse {
    success: boolean;
    note: string;
    timestamp: string;
}

export type AddOrderNote = (params?: AddOrderNoteParams) => Promise<AddOrderNoteResponse>;

