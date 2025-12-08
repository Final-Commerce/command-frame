// Add Customer Note Types
export interface AddCustomerNoteParams {
    customerId: string;
    note: string;
}

export interface AddCustomerNoteResponse {
    success: boolean;
    customerId: string;
    note: string;
    timestamp: string;
}

export type AddCustomerNote = (params?: AddCustomerNoteParams) => Promise<AddCustomerNoteResponse>;

