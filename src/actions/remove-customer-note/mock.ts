import {
    RemoveCustomerNote,
    RemoveCustomerNoteParams,
    RemoveCustomerNoteResponse
} from "./types";

export const mockRemoveCustomerNote: RemoveCustomerNote = async (
    params?: RemoveCustomerNoteParams
): Promise<RemoveCustomerNoteResponse> => {
    console.log("[Mock] removeCustomerNote called", params);

    const noteId = params?.noteId ?? "";
    const timestamp = new Date().toISOString();

    if (!noteId) {
        return { success: false, noteId, timestamp };
    }

    return {
        success: true,
        noteId,
        timestamp
    };
};
