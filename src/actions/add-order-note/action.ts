/**
 * Add order note action
 * Calls the addOrderNote action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    AddOrderNote,
    AddOrderNoteParams,
    AddOrderNoteResponse
} from "./types";

export const addOrderNote: AddOrderNote = async (params?: AddOrderNoteParams): Promise<AddOrderNoteResponse> => {
    return await commandFrameClient.call<AddOrderNoteParams, AddOrderNoteResponse>("addOrderNote", params);
};

