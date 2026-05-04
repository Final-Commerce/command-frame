// Remove Customer Note Types: only noteId; Render resolves the customer in local DB
export interface RemoveCustomerNoteParams {
    noteId: string;
}

export interface RemoveCustomerNoteResponse {
    success: boolean;
    noteId: string;
    timestamp: string;
}

export type RemoveCustomerNote = (params?: RemoveCustomerNoteParams) => Promise<RemoveCustomerNoteResponse>;
