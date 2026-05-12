import { RemoveCustomerNote, RemoveCustomerNoteParams, RemoveCustomerNoteResponse } from "./types";
import { MOCK_CUSTOMERS, mockPublishEvent } from "../../demo/database";

export const mockRemoveCustomerNote: RemoveCustomerNote = (params?: RemoveCustomerNoteParams): Promise<RemoveCustomerNoteResponse> => {
    console.log("[Mock] removeCustomerNote called", params);

    const noteId = params?.noteId ?? "";
    const timestamp = new Date().toISOString();

    if (!noteId) {
        return Promise.resolve({ success: false, noteId, timestamp });
    }

    for (const customer of MOCK_CUSTOMERS) {
        const before = customer.notes?.length ?? 0;
        const removed = (customer.notes || []).find(n => n._id === noteId);
        customer.notes = (customer.notes || []).filter(n => n._id !== noteId);

        if ((customer.notes?.length ?? 0) !== before) {
            mockPublishEvent("customers", "customer-note-deleted", {
                customer,
                note: removed
            });
            return Promise.resolve({ success: true, noteId, timestamp });
        }
    }

    return Promise.resolve({ success: false, noteId, timestamp });
};
