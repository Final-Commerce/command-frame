/**
 * Remove customer note action
 * Calls the removeCustomerNote action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    RemoveCustomerNote,
    RemoveCustomerNoteParams,
    RemoveCustomerNoteResponse
} from "./types";

export const removeCustomerNote: RemoveCustomerNote = async (
    params?: RemoveCustomerNoteParams
): Promise<RemoveCustomerNoteResponse> => {
    return await commandFrameClient.call<RemoveCustomerNoteParams, RemoveCustomerNoteResponse>("removeCustomerNote", params);
};
