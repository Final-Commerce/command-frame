import { commandFrameClient } from "../../client";
import type { SetActiveCustomer, SetActiveCustomerParams, SetActiveCustomerResponse } from "./types";

export const setActiveCustomer: SetActiveCustomer = async (
    params?: SetActiveCustomerParams
): Promise<SetActiveCustomerResponse> => {
    return await commandFrameClient.call<SetActiveCustomerParams, SetActiveCustomerResponse>("setActiveCustomer", params);
};
