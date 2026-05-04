import { RemoveCustomerNote, RemoveCustomerNoteParams, RemoveCustomerNoteResponse } from "./types";

export const mockRemoveCustomerNote: RemoveCustomerNote = (params?: RemoveCustomerNoteParams): Promise<RemoveCustomerNoteResponse> => {
    console.log("[Mock] removeCustomerNote called", params);

    const noteId = params?.noteId ?? "";
    const timestamp = new Date().toISOString();

    if (!noteId) {
        return Promise.resolve({ success: false, noteId, timestamp });
    }

    return Promise.resolve({
        success: true,
        noteId,
        timestamp
    });
};
