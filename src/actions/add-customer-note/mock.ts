import { AddCustomerNote, AddCustomerNoteParams, AddCustomerNoteResponse } from "./types";

export const mockAddCustomerNote: AddCustomerNote = async (params?: AddCustomerNoteParams): Promise<AddCustomerNoteResponse> => {
    console.log("[Mock] addCustomerNote called", params);
    
    return {
        success: true,
        customerId: params?.customerId || "",
        note: params?.note || "",
        timestamp: new Date().toISOString()
    };
};

