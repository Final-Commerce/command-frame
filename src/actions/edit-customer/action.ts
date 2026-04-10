import { commandFrameClient } from "../../client";
import type { EditCustomer, EditCustomerParams, EditCustomerResponse } from "./types";

export const editCustomer: EditCustomer = async (params: EditCustomerParams): Promise<EditCustomerResponse> => {
    return await commandFrameClient.call<EditCustomerParams, EditCustomerResponse>("editCustomer", params);
};
