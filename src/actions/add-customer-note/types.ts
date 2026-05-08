// Add Customer Note Types
// `customerId` is optional — Render auto-resolves from the iterator customer
// (passed by the builder dispatcher) or, failing that, the active customer.
export interface AddCustomerNoteParams {
    note: string;
    customerId?: string;
}

export interface AddCustomerNoteResponse {
    success: boolean;
    customerId: string;
    noteId: string;
    note: string;
    timestamp: string;
}

export type AddCustomerNote = (params: AddCustomerNoteParams) => Promise<AddCustomerNoteResponse>;
