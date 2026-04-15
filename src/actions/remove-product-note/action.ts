import { commandFrameClient } from "../../client";
import type { RemoveProductNote, RemoveProductNoteParams, RemoveProductNoteResponse } from "./types";

export const removeProductNote: RemoveProductNote = async (
    params?: RemoveProductNoteParams
): Promise<RemoveProductNoteResponse> => {
    return await commandFrameClient.call<RemoveProductNoteParams | undefined, RemoveProductNoteResponse>("removeProductNote", params);
};
