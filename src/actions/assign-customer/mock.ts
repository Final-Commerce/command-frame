import { AssignCustomer, AssignCustomerParams, AssignCustomerResponse } from "./types";
import { MOCK_CUSTOMERS, MOCK_CART } from "../../demo/database";

export const mockAssignCustomer: AssignCustomer = async (params: AssignCustomerParams): Promise<AssignCustomerResponse> => {
    console.log("[Mock] assignCustomer called", params);
    
    const customer = MOCK_CUSTOMERS.find(c => c._id === params.customerId);
    if (!customer) {
        throw new Error("Customer not found in mock DB");
    }

    MOCK_CART.customer = customer;

    return {
        success: true,
        customer,
        timestamp: new Date().toISOString()
    };
};

