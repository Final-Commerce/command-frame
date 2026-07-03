import { RemoveOrderNote, RemoveOrderNoteResponse } from "./types";
import { MOCK_CART, mockPublishEvent } from "../../demo/database";

export const mockRemoveOrderNote: RemoveOrderNote = (): Promise<RemoveOrderNoteResponse> => {
    console.log("[Mock] removeOrderNote called");

    // Clear the active cart's note.
    MOCK_CART.orderNotes = undefined;

    // Publish order-note-removed event so cart subscribers refresh.
    mockPublishEvent("cart", "order-note-removed", {});

    return Promise.resolve({
        success: true,
        timestamp: new Date().toISOString()
    });
};
