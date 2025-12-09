import { AddCustomer, AddCustomerParams, AddCustomerResponse } from "./types";
import { CFCustomer } from "../../CommonTypes";
import { MOCK_CUSTOMERS } from "../../demo/database";

export const mockAddCustomer: AddCustomer = async (params?: AddCustomerParams): Promise<AddCustomerResponse> => {
    console.log("[Mock] addCustomer called", params);
    
    if (!params?.customer) throw new Error("Customer data required");

    const newCustomer: CFCustomer = {
        _id: "new_mock_cust_" + Date.now(),
        companyId: "mock_company_id",
        email: params.customer.email || "",
        firstName: params.customer.firstName || "",
        lastName: params.customer.lastName || "",
        phone: params.customer.phone,
        billing: null,
        shipping: null,
        ...params.customer
    } as CFCustomer;

    MOCK_CUSTOMERS.push(newCustomer);

    return {
        success: true,
        customer: newCustomer,
        timestamp: new Date().toISOString()
    };
};

