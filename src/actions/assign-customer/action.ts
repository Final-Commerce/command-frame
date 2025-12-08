/**
 * Assign customer action
 * Calls the assignCustomer action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    AssignCustomer,
    AssignCustomerParams,
    AssignCustomerResponse
} from "./types";

export const assignCustomer: AssignCustomer = async (params: AssignCustomerParams): Promise<AssignCustomerResponse> => {
    return await commandFrameClient.call<AssignCustomerParams, AssignCustomerResponse>("assignCustomer", params);
};

