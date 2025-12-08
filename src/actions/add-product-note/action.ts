/**
 * Add product note action
 * Calls the addProductNote action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    AddProductNote,
    AddProductNoteParams,
    AddProductNoteResponse
} from "./types";

export const addProductNote: AddProductNote = async (params?: AddProductNoteParams): Promise<AddProductNoteResponse> => {
    return await commandFrameClient.call<AddProductNoteParams, AddProductNoteResponse>("addProductNote", params);
};

