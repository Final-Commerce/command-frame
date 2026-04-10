import { commandFrameClient } from "../../client";
import type { GetActiveCustomer, GetActiveCustomerResponse } from "./types";

export const getActiveCustomer: GetActiveCustomer = async (): Promise<GetActiveCustomerResponse> => {
    return await commandFrameClient.call<GetActiveCustomerResponse>("getActiveCustomer");
};
