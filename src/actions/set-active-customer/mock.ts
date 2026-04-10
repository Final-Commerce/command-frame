import { MOCK_CUSTOMERS } from "../../demo/database";
import { SetActiveCustomer, SetActiveCustomerParams, SetActiveCustomerResponse } from "./types";

export const mockSetActiveCustomer: SetActiveCustomer = async (
    params?: SetActiveCustomerParams
): Promise<SetActiveCustomerResponse> => {
    console.log("[Mock] setActiveCustomer called", params);

    if (!params?.customerId) {
        throw new Error("customerId is required");
    }

    const found = MOCK_CUSTOMERS.find(c => c._id === params.customerId);
    if (!found) {
        throw new Error(`Customer with ID ${params.customerId} not found`);
    }

    return {
        success: true,
        customer: { ...found, id: found._id },
        timestamp: new Date().toISOString()
    };
};
