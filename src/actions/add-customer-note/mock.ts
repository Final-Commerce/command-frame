import { AddCustomerNote, AddCustomerNoteParams, AddCustomerNoteResponse } from "./types";
import { MOCK_CUSTOMERS, mockPublishEvent } from "../../demo/database";

function generateNoteId(): string {
    return `mock_note_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export const mockAddCustomerNote: AddCustomerNote = (params: AddCustomerNoteParams): Promise<AddCustomerNoteResponse> => {
    console.log("[Mock] addCustomerNote called", params);

    if (!params?.note) {
        throw new Error("addCustomerNote: note is required");
    }

    const target = params.customerId ? MOCK_CUSTOMERS.find(c => c._id === params.customerId) : MOCK_CUSTOMERS[0];

    if (!target) {
        throw new Error("addCustomerNote: no target customer (provide customerId or seed at least one mock customer)");
    }

    const noteId = generateNoteId();
    const note = {
        _id: noteId,
        message: params.note,
        createdAt: new Date().toISOString()
    };

    target.notes = [...(target.notes || []), note];

    mockPublishEvent("customers", "customer-note-added", {
        customer: target,
        note
    });

    return Promise.resolve({
        success: true,
        customerId: target._id,
        noteId,
        note: params.note,
        timestamp: new Date().toISOString()
    });
};
