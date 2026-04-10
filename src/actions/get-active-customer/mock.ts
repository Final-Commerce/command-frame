import { MOCK_CUSTOMER_1 } from "../../demo/database";
import { GetActiveCustomer, GetActiveCustomerResponse } from "./types";

export const mockGetActiveCustomer: GetActiveCustomer = async (): Promise<GetActiveCustomerResponse> => {
    console.log("[Mock] getActiveCustomer called");

    const customer = { ...MOCK_CUSTOMER_1, id: MOCK_CUSTOMER_1._id };

    return {
        success: true,
        customer,
        timestamp: new Date().toISOString()
    };
};
