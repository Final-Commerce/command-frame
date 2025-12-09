import { AddCustomer, AddCustomerParams, AddCustomerResponse } from "./types";
import { CFCustomer } from "../../CommonTypes";
import { MOCK_CUSTOMERS } from "../../demo/database";

export const mockAddCustomer: AddCustomer = async (params?: AddCustomerParams): Promise<AddCustomerResponse> => {
    console.log("[Mock] addCustomer called", params);
    
    if (!params?.customer) throw new Error("Customer data required");

    const newCustomer: CFCustomer = {
        ...params.customer,
        _id: "new_mock_cust_" + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    MOCK_CUSTOMERS.push(newCustomer);

    return {
        success: true,
        customer: newCustomer,
        timestamp: new Date().toISOString()
    };
};
