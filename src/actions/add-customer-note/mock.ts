import { AddCustomerNote, AddCustomerNoteParams, AddCustomerNoteResponse } from "./types";
import { MOCK_CUSTOMERS } from "../../demo/database";

export const mockAddCustomerNote: AddCustomerNote = async (params?: AddCustomerNoteParams): Promise<AddCustomerNoteResponse> => {
    console.log("[Mock] addCustomerNote called", params);
    
    if (params?.customerId && params.note) {
        const customer = MOCK_CUSTOMERS.find(c => c._id === params.customerId);
        if (customer) {
            if (!customer.notes) {
                customer.notes = [];
            }
            customer.notes.push({
                message: params.note,
                createdAt: new Date().toISOString()
            });
        }
    }

    return {
        success: true,
        customerId: params?.customerId || "",
        note: params?.note || "",
        timestamp: new Date().toISOString()
    };
};

