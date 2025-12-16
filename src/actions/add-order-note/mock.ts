import { AddOrderNote, AddOrderNoteParams, AddOrderNoteResponse } from "./types";
import { MOCK_CART } from "../../demo/database";

export const mockAddOrderNote: AddOrderNote = async (params?: AddOrderNoteParams): Promise<AddOrderNoteResponse> => {
    console.log("[Mock] addOrderNote called", params);
    
    // In Render, AddOrderNote usually adds a note to the active cart if it's not checked out yet.
    if (params?.note) {
        if (MOCK_CART.orderNotes) {
            MOCK_CART.orderNotes += "\n" + params.note;
        } else {
            MOCK_CART.orderNotes = params.note;
        }
    }

    return {
        success: true,
        note: params?.note || "",
        timestamp: new Date().toISOString()
    };
};

