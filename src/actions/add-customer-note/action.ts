/**
 * Add customer note action
 * Calls the addCustomerNote action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    AddCustomerNote,
    AddCustomerNoteParams,
    AddCustomerNoteResponse
} from "./types";

export const addCustomerNote: AddCustomerNote = async (params?: AddCustomerNoteParams): Promise<AddCustomerNoteResponse> => {
    return await commandFrameClient.call<AddCustomerNoteParams, AddCustomerNoteResponse>("addCustomerNote", params);
};

