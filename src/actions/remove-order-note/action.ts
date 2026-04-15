import { commandFrameClient } from "../../client";
import type { RemoveOrderNote, RemoveOrderNoteResponse } from "./types";

export const removeOrderNote: RemoveOrderNote = async (): Promise<RemoveOrderNoteResponse> => {
    return await commandFrameClient.call<RemoveOrderNoteResponse>("removeOrderNote");
};
