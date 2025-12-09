import { AddOrderNote, AddOrderNoteParams, AddOrderNoteResponse } from "./types";

export const mockAddOrderNote: AddOrderNote = async (params?: AddOrderNoteParams): Promise<AddOrderNoteResponse> => {
    console.log("[Mock] addOrderNote called", params);
    
    return {
        success: true,
        note: params?.note || "",
        timestamp: new Date().toISOString()
    };
};

