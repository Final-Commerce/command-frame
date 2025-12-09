import { AddProductNote, AddProductNoteParams, AddProductNoteResponse } from "./types";

export const mockAddProductNote: AddProductNote = async (params?: AddProductNoteParams): Promise<AddProductNoteResponse> => {
    console.log("[Mock] addProductNote called", params);
    
    return {
        success: true,
        note: params?.note || "",
        timestamp: new Date().toISOString()
    };
};

