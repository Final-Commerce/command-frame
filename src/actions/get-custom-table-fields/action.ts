/**
 * Get custom table fields action
 * Calls the getCustomTableFields action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GetCustomTableFields,
    GetCustomTableFieldsParams,
    GetCustomTableFieldsResponse
} from "./types";

export const getCustomTableFields: GetCustomTableFields = async (
    params: GetCustomTableFieldsParams
): Promise<GetCustomTableFieldsResponse> => {
    return await commandFrameClient.call<GetCustomTableFieldsParams, GetCustomTableFieldsResponse>(
        "getCustomTableFields",
        params
    );
};

